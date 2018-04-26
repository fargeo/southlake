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
                'street_seg_placeholder', 
                'street_num_placeholder',
                'street_num_suffix_placeholder'
            ];
            WidgetViewModel.apply(this, [params]);
            var self = this;

            // check to see if node is populated
            // if it isn't disable widget and alert the user

            this.disabled = ko.observable(true);
            this.dataLoaded = ko.observable(false);
            this.coordinates = [];
            this.data = {
                features: []
            };

            if (params.form) {
                this.disabled.subscribe(function(disabled){
                    if(!disabled){
                        $.ajax({
                            //dataType: "json",
                            url: 'https://services8.arcgis.com/jXmOK21AXdxcpkCM/ArcGIS/rest/services/San_Francisco_Basemap_Street_Centerlines/FeatureServer/0/query',
                            data:{
                                where: '',
                                objectIds: '',
                                time: '',
                                geometry: this.coordinates[0] + ',' + this.coordinates[1],
                                geometryType: 'esriGeometryPoint',
                                inSR: '4326',
                                spatialRel: 'esriSpatialRelIntersects',
                                resultType: 'standard',
                                distance: '100',
                                units: 'esriSRUnit_Meter',
                                returnGeodetic: false,
                                outFields: '*',
                                returnHiddenFields: false,
                                returnGeometry: true,
                                multipatchOption: 'xyFootprint',
                                maxAllowableOffset: '',
                                geometryPrecision: '',
                                outSR: '4326',
                                datumTransformation: '',
                                applyVCSProjection: false,
                                returnIdsOnly: false,
                                returnCountOnly: false,
                                returnExtentOnly: false,
                                returnDistinctValues: false,
                                orderByFields: '',
                                groupByFieldsForStatistics: '',
                                outStatistics: '',
                                having: '',
                                resultOffset: '',
                                resultRecordCount: '',
                                returnZ: false,
                                returnM: false,
                                returnExceededLimitFeatures: true,
                                quantizationParameters: '',
                                sqlFormat: 'none',
                                f: 'json',
                                token: 'tTzVkJ7RPpZmqmlxc7xVBaORWK8vIKQenSkbmK13OnDfIHNKaNCIaH3i6Nz1AUbdnqkEsz8HuA-QqYrndP4yyqgov0NUgabK3lOO19erL-YYPtbIhEzahbSeQ0wPkJx1TH7RVL-gJ9m3iBsV9Affr0NczrLunSdj6rsa1Kg4QI8fTWpdgj0VCy7FaANWggjI6b7kDATtb43W9-hHxmndcjEU9S7lBzCfTty1b4GnAF3dmYhoh4ZBLC-XpsLetKEJ'
                            },
                            success: function(data) {
                                if(data.length > 0) {
                                    self.data = JSON.parse(data);
                                    self.dataLoaded(true);
                                }
                            }
                        });
                    }
                }, this);

                var getNodeIdFromName = function(node_name){
                    var node = _.find(params.form.cards()[0].attributes.data.nodes, function(node){
                        return node.name === node_name;
                    })
                    return node.nodeid;
                }
                var nodeid = getNodeIdFromName(this.depends_on());
                if (!!nodeid) {
                    // address point node is local to the card
                    var node_data = ko.unwrap(params.form.formTiles()[0].data[nodeid]);
                    if (!!node_data) {
                        self.coordinates = ko.unwrap(ko.unwrap(node_data.features)[0].geometry.coordinates);
                        self.disabled(false);
                    }else{
                        params.form.formTiles()[0].data[nodeid].subscribe(function(node_data){
                            if (!!node_data) {
                                self.coordinates = node_data.features[0].geometry.coordinates;
                                self.disabled(false);
                            }
                        })
                    }
                }else{
                    // address point node is on another card
                    var url = arches.urls.resource_node_data.replace('//', '/' + params.form.resourceid + '/') + this.depends_on();
                    $.ajax({
                        dataType: "json",
                        url: url,
                        success: function(data) {
                            if(data.length > 0) {
                                self.coordinates = data[0].features[0].geometry.coordinates;
                                self.disabled(false);
                            }
                        }
                    });
                }
            }

            if (ko.unwrap(this.value)) {
                var street_obj = this.value;
                this.street_number = street_obj.street_number;
                this.street_segment_id = street_obj.street_segment_id;
                this.street_name = street_obj.street_name;
                this.street_number_suffix = street_obj.street_number_suffix;
            } else {
                this.street_number = ko.observable('');
                this.street_segment_id = ko.observable('');
                this.street_name = ko.observable('');
                this.street_number_suffix = ko.observable('');
                this.value({
                    street_number: this.street_number,
                    street_segment_id: this.street_segment_id,
                    street_name: this.street_name,
                    street_number_suffix: this.street_number_suffix
                })
            };

            this.select2Config = {
                value: this.street_segment_id,
                clickBubble: true,
                multiple: this.multiple,
                placeholder: this.street_seg_placeholder,
                allowClear: true,
                query: function (query) {
                    var data = {results: self.data.features};
                    query.callback(data);
                },
                initSelection: function(element, callback) {
                    self.dataLoaded.subscribe(function(dataLoaded){
                        var id = $(element).val();
                        if (id !== "") {
                            if(dataLoaded){
                                var data = self.data.features;
                                var selection =  _.find(data, function (street_seg) {
                                    return street_seg.attributes.cnn.toString() === id;
                                });
                                if (selection) {
                                    callback(selection);
                                }
                            }
                        }
                    });
                },
                escapeMarkup: function (m) { return m; },
                id: function(street_seg) {
                    return street_seg.attributes.cnn;
                },
                formatResult: function(street_seg) {
                    var street_name = street_seg.attributes.streetname;
                    var max_add = Math.max(street_seg.attributes.rt_toadd,street_seg.attributes.lf_toadd);
                    var min_add = Math.min(street_seg.attributes.rt_fadd,street_seg.attributes.lf_fadd);

                    var markup = '<div class="node-value-select-tile">' +
                        '<div class="selected-node-value">' +
                        street_name + ' (from: ' + min_add + ', to: ' + max_add + ')'
                        '</div>';
                    markup += '</div>';
                    return markup;
                },
                formatSelection: function(street_seg) {
                    var street_name = street_seg.attributes.streetname;
                    var max_add = Math.max(street_seg.attributes.rt_toadd,street_seg.attributes.lf_toadd);
                    var min_add = Math.min(street_seg.attributes.rt_fadd,street_seg.attributes.lf_fadd);

                    //self.street_num(street_seg.attributes.streetname);
                    self.street_segment_id(street_seg.attributes.cnn);
                    self.street_name(street_seg.attributes.streetname);
                    return street_name + ' (from: ' + min_add + ', to: ' + max_add + ')';
                }
            };
        },
        template: { require: 'text!templates/views/components/widgets/street-number.htm' }
    });
});
