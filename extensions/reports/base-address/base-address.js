define(['knockout', 'viewmodels/report', 'views/components/widgets/map'], function (ko, ReportViewModel) {
    return ko.components.register('base-address-report', {
        viewModel: function(params) {
            params.configKeys = ['zoom', 'centerX', 'centerY', 'geocoder', 'basemap', 'geometryTypes', 'pitch', 'bearing', 'geocodePlaceholder'];

            ReportViewModel.apply(this, [params]);

            var tiles = this.report.get('tiles')
            this.feature_count = 0
            this.forReportManager = false

            if (tiles) {
                tiles.forEach(function(tile) {
                    _.each(tile.data, function(val, key) {
                        if (_.contains(val, 'FeatureCollection')) {
                            this.feature_count += 1
                        }
                    }, this);
                }, this)
            } else {
                this.forReportManager = true;
            }
            this.onInit = function (map) {
                if (map) {
                    console.log(map);
                }
            }
        },
        template: { require: 'text!templates/views/components/reports/base-address.htm' }
    });
});
