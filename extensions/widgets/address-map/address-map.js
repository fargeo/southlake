define([
    'knockout',
    'views/components/widgets/map'
], function (ko, MapWidgetViewModel) {
    return ko.components.register('address-map', {
        viewModel: function(params) {
            var self = this;
            params.onInit = function (map) {
                if (map) {
                    var segmentId = 657000;
                    self.map.on('load', function (map) {
                        console.log(map);
                    });
                }
            }
            MapWidgetViewModel.apply(this, [params]);
        },
        template: { require: 'text!widget-templates/map' }
    });
});
