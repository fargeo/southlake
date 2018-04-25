from arches.app.datatypes.base import BaseDataType
from arches.app.models import models
from arches.app.models.system_settings import settings

street_number = models.Widget.objects.get(name='street-number')

details = {
    'datatype': 'street-number',
    'iconclass': 'fa fa-file-code-o',
    'modulename': 'datatypes.py',
    'classname': 'StreetNumberDatatype',
    'defaultwidget': street_number,
    'defaultconfig': None,
    'configcomponent': None,
    'configname': None,
    'isgeometric': False
    }

class StreetNumberDatatype(BaseDataType):

    def validate(self, value, row_number=None, source=None):
        errors = []
        # try:
        #     value.upper()
        # except:
        #     errors.append({'type': 'ERROR', 'message': 'datatype: {0} value: {1} {2} - {3}. {4}'.format(self.datatype_model.datatype, value, source, 'this is not a string', 'This data was not imported.')})
        return errors


    def transform_import_values(self, value, nodeid):
        v = value.split('|')
        de = {}
        de["street_segment_id"] = v[0]
        de["street_number"] = v[1]
        de["street_name_suffix"] = v[2]
        de["street_name"] = v[3]

        return de

    def append_to_document(self, document, nodevalue, nodeid, tile):
        document['strings'].append({'string': nodevalue['street_name'], 'nodegroup_id': tile.nodegroup_id})

    def transform_export_values(self, value, *args, **kwargs):
        if value != None:
            return value.encode('utf8')

    def get_search_terms(self, nodevalue, nodeid=None):
        terms = []
        if nodevalue['street_name'] is not None:
            if settings.WORDS_PER_SEARCH_TERM == None or (len(nodevalue['street_name'].split(' ')) < settings.WORDS_PER_SEARCH_TERM):
                terms.append(nodevalue['street_name'])
        return terms

    def append_search_filters(self, value, node, query, request):
        try:
            if value['val'] != '':
                match_type = 'phrase_prefix' if '~' in value['op'] else 'phrase'
                match_query = Match(field='tiles.data.%s' % (str(node.pk)), query=value['val'], type=match_type)
                if '!' in value['op']:
                    query.must_not(match_query)
                    query.filter(Exists(field="tiles.data.%s" % (str(node.pk))))
                else:
                    query.must(match_query)
        except KeyError, e:
            pass
