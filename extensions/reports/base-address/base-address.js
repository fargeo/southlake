define(['knockout', 'viewmodels/report', 'views/components/widgets/map'], function (ko, ReportViewModel) {
    return ko.components.register('base-address-report', {
        viewModel: function(params) {
            params.configKeys = ['zoom', 'centerX', 'centerY', 'geocoder', 'basemap', 'geometryTypes', 'pitch', 'bearing', 'geocodePlaceholder'];

            ReportViewModel.apply(this, [params]);

            var tiles = this.report.get('tiles')
            this.feature_count = 0
            this.forReportManager = false
            var segmentId;
            var parcelId;
            if (tiles) {
                tiles.forEach(function(tile) {
                    _.each(tile.data, function(val, key) {
                        if (_.contains(val, 'FeatureCollection')) {
                            this.feature_count += 1
                        }
                        if (key === '1a08f80e-4746-11e8-b7cc-0242ac120006') {
                            segmentId = parseInt(val);
                        }
                        if (key === '29862afe-4746-11e8-88b1-0242ac120006') {
                            parcelId = val;
                        }
                        
                    }, this);
                }, this)
            } else {
                this.forReportManager = true;
            }
            this.onInit = function (map) {
                if (map) {
                    map.on('load', function () {
                        map.addLayer({
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
                            "filter": ["==", "cnn", segmentId],
                        });
                        map.addLayer({
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
                            "filter": ["==", "blklot", parcelId],
                        });
                    });
                }
            }
        },
        template: { require: 'text!templates/views/components/reports/base-address.htm' }
    });
});
