import uuid
import urllib2, urllib
import json
from pprint import pprint as pp
from django.core.exceptions import ValidationError
from arches.app.models import models
from arches.app.models.tile import Tile
from arches.app.functions.base import BaseFunction
from arches.app.datatypes.datatypes import DataTypeFactory

details = {
    'name': 'Export Address',
    'type': 'node',
    'description': 'Just a sample demonstrating node group selection',
    'defaultconfig': {"external_address_url":""},
    'classname': 'ExportAddress',
    'component': 'views/components/functions/export-address'
}

class ExportAddress(BaseFunction):

    def save(self, tile, request):
        tile_edits = json.loads(request.POST.get('data'))['data']
        if request:
            address = {
                "geometry": {
                    "x": -13634625.801170558,
                    "y": 4552300.195423533,
                    "spatialReference": {
                        "wkid": 102100,
                        "latestWkid": 3857
                    }
                },
                "attributes": {
                    "EAS_BaseID": None,
                    "EAS_SubID": None,
                    "CNN": None,
                    "Address": None,
                    "Address_Number": None,
                    "Address_Number_Suffix": None,
                    "Street_Name": None,
                    "Street_Type": None,
                    "Unit_Number": None,
                    "Zipcode": None,
                    "Block_Lot": None,
                    "Longitude": None,
                    "Latitude": None,
                    "Location": None
                }
            }

            payload = {
                "edits":[],
                "f": "json",
                "token": "YDi8Lxj3kFFZnr5-23qBu4CUBIqIg6SavpLOyITR9c6N4fvuXs9v8X6zQv50PX5dStWzuNuva6YFofpbU-yQ_b90UelcYr3Zgr91iv5ioiJKPC4uXjCklAw1lywLSUBzkwnMsEHzwm-GBRCcXygKKCMJhbVZ9i-GMBsVBuSZ0NVwhNVgpzSn_LjMjmOJ9XUzC-o6TMZopQ3JmqRhyCHr0Yy-2YGJg0EeEBZbYPlaAMNFN2pfe3Mo1a9GRSAeJHaE"
            }

            field_lookup = {
                "29862afe-4746-11e8-88b1-0242ac120006": "Block_Lot",
                "1a08f610-4746-11e8-b7cc-0242ac120006": "Street Name",
                "1a08fbd8-4746-11e8-b7cc-0242ac120006": "Address_Number",
                "1a08f3cc-4746-11e8-b7cc-0242ac120006": "Address_Number_Suffix",
                "1a08f80e-4746-11e8-b7cc-0242ac120006": "CNN",
            }

            tiles = Tile.objects.filter(resourceinstance=tile.resourceinstance_id)
            for tile in tiles:
                for tile_node, tile_value in tile.data.iteritems():
                    if tile_node in field_lookup:
                        if tile_node in tile_edits:
                            tile_value = tile_edits[tile_node]
                            print "using new tile value", tile_value
                        print "in lookup", tile_node, tile_value
                        address["attributes"][field_lookup[tile_node]] = tile_value

            payload["edits"].append({"id":0, "adds":[address]})
            pp(payload)
            print json.dumps(payload)
            data = urllib.urlencode(payload)
            url = 'https://services8.arcgis.com/jXmOK21AXdxcpkCM/ArcGIS/rest/services/SF_Addresses/FeatureServer/0/applyEdits'
            print data
            print 'making request'
            req = urllib2.Request(url, data)
            print 'opening request'
            f = urllib2.urlopen(req)
            print 'reading response'
            response = f.read()
            print 'response', response
            f.close()
        return tile




# EAS_BaseID (type: esriFieldTypeInteger, alias: EAS BaseID, SQL Type: sqlTypeInteger, nullable: true, editable: true)
# EAS_SubID (type: esriFieldTypeInteger, alias: EAS SubID, SQL Type: sqlTypeInteger, nullable: true, editable: true)
# CNN (type: esriFieldTypeInteger, alias: CNN, SQL Type: sqlTypeInteger, nullable: true, editable: true)
# Address (type: esriFieldTypeString, alias: Address, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Address_Number (type: esriFieldTypeInteger, alias: Address Number, SQL Type: sqlTypeInteger, nullable: true, editable: true)
# Address_Number_Suffix (type: esriFieldTypeString, alias: Address Number Suffix, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Street_Name (type: esriFieldTypeString, alias: Street Name, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Street_Type (type: esriFieldTypeString, alias: Street Type, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Unit_Number (type: esriFieldTypeString, alias: Unit Number, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Zipcode (type: esriFieldTypeInteger, alias: Zipcode, SQL Type: sqlTypeInteger, nullable: true, editable: true)
# Block_Lot (type: esriFieldTypeString, alias: Block Lot, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# Longitude (type: esriFieldTypeDouble, alias: Longitude, SQL Type: sqlTypeFloat, nullable: true, editable: true)
# Latitude (type: esriFieldTypeDouble, alias: Latitude, SQL Type: sqlTypeFloat, nullable: true, editable: true)
# Location (type: esriFieldTypeString, alias: Location, SQL Type: sqlTypeNVarchar, length: 256, nullable: true, editable: true)
# FID (type: esriFieldTypeOID, alias: FID, SQL Type: sqlTypeInteger, length: 0, nullable: false, editable: false)
# GlobalID (type: esriFieldTypeGlobalID, alias: GlobalID, SQL Type: sqlTypeOther, length: 38, nullable: false, editable: false)
# CreationDate (type: esriFieldTypeDate, alias: CreationDate, SQL Type: sqlTypeOther, length: 8, nullable: true, editable: false)
# Creator (type: esriFieldTypeString, alias: Creator, SQL Type: sqlTypeOther, length: 128, nullable: true, editable: false)
# EditDate (type: esriFieldTypeDate, alias: EditDate, SQL Type: sqlTypeOther, length: 8, nullable: true, editable: false)
# Editor (type: esriFieldTypeString, alias: Editor, SQL Type: sqlTypeOther, length: 128, nullable: true, editable: false)
