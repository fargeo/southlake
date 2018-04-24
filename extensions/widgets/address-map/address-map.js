define([
    'knockout',
    'views/components/widgets/map'
], function (ko, MapWidgetViewModel) {
    return ko.components.register('address-map', {
        viewModel: function(params) {
            var self = this;
            params.onInit = function (map) {
                if (map) {
                    self.map.on('load', function (map) {
                        var streetsHighlightLayer = self.map.addLayer({
                            "id": "highlighted-report-street",
                            "type": "line",
                            "source": "sf_streets",
                            "source-layer": "sf_streets",
                            "layout": {
                                "line-join": "round",
                                "line-cap": "round"
                            },
                            "paint": {
                                "line-color": "#0029ff",
                                "line-width": 8
                            },
                            "filter": ["==", "cnn", ""]
                        });
                        var parentTile = self.form.tiles["1a08d6c6-4746-11e8-b7cc-0242ac120006"];
                        var segmentId;
                        var findSegmentId = function () {
                            var tiles = parentTile();
                            if (tiles.length > 0) {
                                segmentId = tiles[0].tiles["1a08e008-4746-11e8-b7cc-0242ac120006"]()[0].data['1a08f80e-4746-11e8-b7cc-0242ac120006'];
                                if (ko.unwrap(segmentId)) {
                                    updateFilter();
                                }
                                segmentId.subscribe(updateFilter);
                            }
                        };
                        var updateFilter = function () {
                            var id = ko.unwrap(segmentId);
                            if (id) {
                                id = parseInt(id);
                            } else {
                                id = "";
                            }
                            self.map.setFilter('highlighted-report-street', ["==", "cnn", id]);
                        };
                        findSegmentId();
                        parentTile.subscribe(findSegmentId);
                    });
                }
            }
            MapWidgetViewModel.apply(this, [params]);
        },
        template: { require: 'text!widget-templates/map' }
    });
});
