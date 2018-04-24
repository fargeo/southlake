import uuid
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
        if request:
            tiles = Tile.objects.filter(resourceinstance=tile.resourceinstance_id)
        return tile
