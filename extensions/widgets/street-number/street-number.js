define([
    'arches',
    'jquery',
    'knockout', 
    'underscore', 
    'viewmodels/widget'], function (arches, $, ko, _, WidgetViewModel) {
    /**
    * registers a text-widget component for use in forms
    * @function external:"ko.components".text-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the text input
    * @param {string} params.config().placeholder - default text to show in the text input
    */
    return ko.components.register('street-number', {
        viewModel: function(params) {
            params.configKeys = [
                'depends_on', 
                'street_centerline', 
                'street_seg_placeholder', 
                'street_num_placeholder'
            ];
            WidgetViewModel.apply(this, [params]);
            var self = this;

            // check to see if node is populated
            // if it isn't disable widget and alert the user

            this.disabled = ko.observable(true);

            // simpulate call to find out if node is populated
            // window.setTimeout(function(){
            //     self.disabled(false)
            // },1000)

            if (params.form) {
                //this.depends_on('location');
                var url = arches.urls.resource_node_data.replace('//', '/' + params.form.resourceid + '/') + this.depends_on();

                $.ajax({
                    dataType: "json",
                    url: url,
                    success: function(data) {
                        if(data.length > 0) {
                            self.disabled(false);
                        }
                    }
                });
                
            }

            this.select2Config = {
                value: this.value,
                clickBubble: true,
                multiple: this.multiple,
                placeholder: this.street_seg_placeholder,
                allowClear: true,
                query: function (query) {
                    var data = {results: []}
                    // call out to service to select street segments here\
                    data = self.data;
                    query.callback({results: data.features});
                },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "") {
                        var data = self.data.features;
                        var selection =  _.find(data, function (street_seg) {
                            return street_seg.attributes.FID.toString() === id;
                        });
                        if (selection) {
                            callback(selection);
                        }
                    }
                },
                escapeMarkup: function (m) { return m; },
                id: function(street_seg) {
                    return street_seg.attributes.FID;
                },
                formatResult: function(street_seg) {
                    var street_name = street_seg.attributes.streetname;
                    var max_add = Math.max(street_seg.attributes.rt_toadd,street_seg.attributes.lf_toadd);
                    var min_add = Math.min(street_seg.attributes.rt_fadd,street_seg.attributes.lf_fadd);
                    // var nodeid = params.node.config.nodeid();
                    // var nodeDisplayValue = _.find(tile.display_values, function(displayValue) {
                    //     return nodeid === displayValue.nodeid;
                    // });
                    // var markup = '<div class="node-value-select-tile">' +
                    //     '<div class="selected-node-value">' +
                    //     getDisplayValueMarkup(nodeDisplayValue) +
                    //     '</div>';

                    var markup = '<div class="node-value-select-tile">' +
                        '<div class="selected-node-value">' +
                        street_name + ' (from: ' + min_add + ', to: ' + max_add + ')'
                        '</div>';

                    // tile.display_values.forEach(function(displayValue) {
                    //     if (nodeid !== displayValue.nodeid) {
                    //         markup += getDisplayValueMarkup(displayValue);
                    //     }
                    // });
                    markup += '</div>';
                    return markup;
                },
                formatSelection: function(street_seg) {
                    var street_name = street_seg.attributes.streetname;
                    var max_add = Math.max(street_seg.attributes.rt_toadd,street_seg.attributes.lf_toadd);
                    var min_add = Math.min(street_seg.attributes.rt_fadd,street_seg.attributes.lf_fadd);

                    return street_name + ' (from: ' + min_add + ', to: ' + max_add + ')';
                }
            };

            if (this.value()) {
                var street_num = value();
                var street_seg = value();
                this.street_num = ko.observable(street_num);
                this.street_seg = ko.observable(street_seg);
            } else {
                this.street_num = ko.observable();
                this.street_seg = ko.observable();
            };

            this.data = {
              "objectIdFieldName" : "FID", 
              "globalIdFieldName" : "", 
              "geometryProperties" : 
              {
                "shapeLengthFieldName" : "Shape__Length", 
                "units" : "esriDecimalDegrees"
              }, 
              "geometryType" : "esriGeometryPolyline", 
              "spatialReference" : {
                "wkid" : 4326, 
                "latestWkid" : 4326
              }, 
              "features" : [
                {
                  "attributes" : {
                    "FID" : 12521, 
                    "rt_fadd" : 1800, 
                    "oneway" : "T", 
                    "f_node_cnn" : 26521000, 
                    "street_gc" : "BUSH", 
                    "multigeom" : 0, 
                    "classcode" : "4", 
                    "lf_toadd" : 1899, 
                    "street" : "BUSH", 
                    "zip_code" : "94109", 
                    "cnntext" : "3448000", 
                    "accepted" : "Y", 
                    "cnn" : 3448000, 
                    "nhood" : "Lower Pacfic Heights", 
                    "streetname" : "BUSH ST", 
                    "district" : " ", 
                    "rt_toadd" : 1898, 
                    "jurisdicti" : "DPW", 
                    "t_node_cnn" : 26525000, 
                    "layer" : "STREETS", 
                    "st_type" : "ST", 
                    "lf_fadd" : 1801, 
                    "Shape__Length" : 0.00167383251492168
                  }, 
                  "geometry" : 
                  {
                    "paths" : 
                    [
                      [
                        [-122.42686464323, 37.7878624428439], 
                        [-122.428525011175, 37.7876505617987]
                      ]
                    ]
                  }
                }, 
                {
                  "attributes" : {
                    "FID" : 5977, 
                    "rt_fadd" : 2000, 
                    "oneway" : "F", 
                    "f_node_cnn" : 26527000, 
                    "street_gc" : "PINE", 
                    "multigeom" : 0, 
                    "classcode" : "4", 
                    "lf_toadd" : 2099, 
                    "street" : "PINE", 
                    "zip_code" : "94115", 
                    "cnntext" : "10482000", 
                    "accepted" : "Y", 
                    "cnn" : 10482000, 
                    "nhood" : "Lower Pacfic Heights", 
                    "streetname" : "PINE ST", 
                    "district" : " ", 
                    "rt_toadd" : 2098, 
                    "jurisdicti" : "DPW", 
                    "t_node_cnn" : 26532000, 
                    "layer" : "STREETS", 
                    "st_type" : "ST", 
                    "lf_fadd" : 2001, 
                    "Shape__Length" : 0.00165700946719951
                  }, 
                  "geometry" : 
                  {
                    "paths" : 
                    [
                      [
                        [-122.428712111026, 37.7885770679644], 
                        [-122.430355918053, 37.7883683125335]
                      ]
                    ]
                  }
                }, 
                {
                  "attributes" : {
                    "FID" : 12522, 
                    "rt_fadd" : 1900, 
                    "oneway" : "T", 
                    "f_node_cnn" : 26525000, 
                    "street_gc" : "BUSH", 
                    "multigeom" : 0, 
                    "classcode" : "4", 
                    "lf_toadd" : 1999, 
                    "street" : "BUSH", 
                    "zip_code" : "94115", 
                    "cnntext" : "3449000", 
                    "accepted" : "Y", 
                    "cnn" : 3449000, 
                    "nhood" : "Lower Pacfic Heights", 
                    "streetname" : "BUSH ST", 
                    "district" : " ", 
                    "rt_toadd" : 1998, 
                    "jurisdicti" : "DPW", 
                    "t_node_cnn" : 26531000, 
                    "layer" : "STREETS", 
                    "st_type" : "ST", 
                    "lf_fadd" : 1901, 
                    "Shape__Length" : 0.00165670067025714
                  }, 
                  "geometry" : 
                  {
                    "paths" : 
                    [
                      [
                        [-122.428525011175, 37.7876505617987], 
                        [-122.430168382015, 37.7874408253166]
                      ]
                    ]
                  }
                }, 
                {
                  "attributes" : {
                    "FID" : 9276, 
                    "rt_fadd" : 1800, 
                    "oneway" : "B", 
                    "f_node_cnn" : 26525000, 
                    "street_gc" : "LAGUNA", 
                    "multigeom" : 0, 
                    "classcode" : "5", 
                    "lf_toadd" : 1899, 
                    "street" : "LAGUNA", 
                    "zip_code" : "94115", 
                    "cnntext" : "7967000", 
                    "accepted" : "Y", 
                    "cnn" : 7967000, 
                    "nhood" : "Lower Pacfic Heights", 
                    "streetname" : "LAGUNA ST", 
                    "district" : " ", 
                    "rt_toadd" : 1898, 
                    "jurisdicti" : "DPW", 
                    "t_node_cnn" : 26527000, 
                    "layer" : "STREETS", 
                    "st_type" : "ST", 
                    "lf_fadd" : 1801, 
                    "Shape__Length" : 0.000945208987094629
                  }, 
                  "geometry" : 
                  {
                    "paths" : 
                    [
                      [
                        [-122.428525011175, 37.7876505617987], 
                        [-122.428712111026, 37.7885770679644]
                      ]
                    ]
                  }
                }, 
                {
                  "attributes" : {
                    "FID" : 9274, 
                    "rt_fadd" : 1700, 
                    "oneway" : "B", 
                    "f_node_cnn" : 26519000, 
                    "street_gc" : "LAGUNA", 
                    "multigeom" : 0, 
                    "classcode" : "5", 
                    "lf_toadd" : 1799, 
                    "street" : "LAGUNA", 
                    "zip_code" : "94115", 
                    "cnntext" : "7966000", 
                    "accepted" : "Y", 
                    "cnn" : 7966000, 
                    "nhood" : "Lower Pacfic Heights", 
                    "streetname" : "LAGUNA ST", 
                    "district" : " ", 
                    "rt_toadd" : 1798, 
                    "jurisdicti" : "DPW", 
                    "t_node_cnn" : 26525000, 
                    "layer" : "STREETS", 
                    "st_type" : "ST", 
                    "lf_fadd" : 1701, 
                    "Shape__Length" : 0.00095683841360442
                  }, 
                  "geometry" : 
                  {
                    "paths" : 
                    [
                      [
                        [-122.428335613418, 37.7867126554923], 
                        [-122.428525011175, 37.7876505617987]
                      ]
                    ]
                  }
                }
              ]
            }
        },
        template: { require: 'text!templates/views/components/widgets/street-number.htm' }
    });
});
