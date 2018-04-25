define([
    'knockout',
    'underscore',
    'views/components/widgets/map'
], function (ko, _, MapWidgetViewModel) {
    return ko.components.register('address-map', {
        viewModel: function(params) {
            var self = this;
            params.onInit = function (map) {
                if (map) {
                    self.map.on('load', function (map) {
                        self.map.addLayer({
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
                        self.map.addLayer({
                            "id": "highlighted-report-parcel",
                            "type": "fill",
                            "source": "sf_parcels",
                            "source-layer": "sf_parcels",
                            "layout": {
                                "visibility": "visible"
                            },
                            'paint': {
                                'fill-color': '#f08',
                                'fill-opacity': 0.15
                            },
                            "filter": ["in", "blklot", ""],
                        });
                        var parcelCardId = "29862126-4746-11e8-88b1-0242ac120006";
                        var parcelNumberId = "29862afe-4746-11e8-88b1-0242ac120006";
                        var parcelTiles = self.form.tiles[parcelCardId];

                        var streetCardId = "1a08d6c6-4746-11e8-b7cc-0242ac120006";
                        var streetSegCardId = "1a08e008-4746-11e8-b7cc-0242ac120006";
                        var streetSegNodeId = "1a08f80e-4746-11e8-b7cc-0242ac120006";
                        var streetsTiles = self.form.tiles[streetCardId];
                        var segmentId;
                        var findSegmentId = function () {
                            var tiles = streetsTiles();
                            if (tiles.length > 0) {
                                segmentId = tiles[0].tiles[streetSegCardId]()[0].data[streetSegNodeId];
                                updateFilter();
                                segmentId.subscribe(updateFilter);
                            }
                        };
                        var updateFilter = function () {
                            var streetSegId = ko.unwrap(segmentId);
                            var parcels = parcelTiles();
                            var parcelFilter;
                            if (parcels.length === 0) {
                                parcelFilter = [""]
                            } else {
                                parcelFilter = parcels.map(function (tile) {
                                    tile.data[parcelNumberId].subscribe(updateFilter);
                                    return tile.data[parcelNumberId]()
                                });
                            }
                            streetSegId = streetSegId ? parseInt(streetSegId) : "";
                            self.map.setFilter('highlighted-report-street', ["==", "cnn", streetSegId]);
                            self.map.setFilter('highlighted-report-parcel', ["in", "blklot"].concat(parcelFilter));
                        };
                        findSegmentId();
                        streetsTiles.subscribe(findSegmentId);
                        parcelTiles.subscribe(updateFilter);
                        updateFilter();
                    });
                }
            }
            MapWidgetViewModel.apply(this, [params]);
        },
        template: { require: 'text!widget-templates/map' }
    });
});
