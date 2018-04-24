define([
    'arches',
    'jquery',
    'knockout',
    'underscore',
    'views/widgets/map'
], function (arches, $, ko, _, MapWidgetViewModel) {
    return ko.components.register('address-map', {
        viewModel: function(params) {
            var self = this;
            MapWidgetViewModel.apply(this, [params]);
            var segmentId = 657000;
            this.map.on('load', function () {
                console.log(self.map);
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
                    "filter": ["==", "cnn", segmentId],
                });
            });
        }
        },
        require: 'text!widget-templates/map'
    });
});
