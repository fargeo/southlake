INSERT INTO map_layers(maplayerid, name, layerdefinitions, isoverlay, icon, activated, addtomap)
   VALUES (public.uuid_generate_v1mc(), 'Search Results', '[
        {
           "id": "search-results-heat",
           "maxzoom": 17,
           "minzoom": 9,
           "type": "heatmap",
           "source": "search-results-hashes",
           "paint": {
               "heatmap-weight": [
                   "interpolate", [
                       "linear"
                   ],
                   [
                       "get",
                       "doc_count"
                   ],
                   0,
                   0,
                   6,
                   1
               ],
               "heatmap-intensity": [
                   "interpolate", [
                       "linear"
                   ],
                   [
                       "zoom"
                   ],
                   0,
                   1,
                   25,
                   10
               ],
               "heatmap-color": [
                   "interpolate", [
                       "linear"
                   ],
                   [
                       "heatmap-density"
                   ],
                   0,
                   "rgba(33,102,172,0)",
                   0.2,
                   "rgb(103,169,207)",
                   0.4,
                   "rgb(209,229,240)",
                   0.6,
                   "rgb(253,219,199)",
                   0.8,
                   "rgb(239,138,98)",
                   1,
                   "rgb(178,24,43)"
               ],
               "heatmap-radius": [
                   "interpolate", [
                       "linear"
                   ],
                   [
                       "zoom"
                   ],
                   0,
                   2,
                   25,
                   75
               ],
               "heatmap-opacity": 0.6
           }
       }
   ]', TRUE, 'ion-search', TRUE, FALSE);



INSERT INTO map_layers(maplayerid, name, layerdefinitions, isoverlay, icon, activated, addtomap)
   VALUES (public.uuid_generate_v1mc(), 'Map Markers', '[
       {
           "id": "search-results-points-markers",
           "type": "symbol",
           "source": "search-results-points",
           "filter": [
               "all", [
                   "==",
                   "$type",
                   "Point"
               ],
               [
                   "!=",
                   "highlight",
                   true
               ]
           ],
           "layout": {
               "icon-image": "marker-15",
               "icon-size": 1,
               "icon-offset": [0, -6],
               "icon-allow-overlap": true
           },
           "paint": {}
       },
       {
           "id": "search-results-points-markers-highlighted",
           "type": "symbol",
           "source": "search-results-points",
           "filter": [
               "all", [
                   "==",
                   "$type",
                   "Point"
               ],
               [
                   "==",
                   "highlight",
                   true
               ]
           ],
           "layout": {
               "icon-image": "marker-15",
               "icon-size": 1.3,
               "icon-offset": [0, -6],
               "icon-allow-overlap": true
           },
           "paint": {}
       }
   ]', TRUE, 'ion-location', TRUE, TRUE);



INSERT INTO map_layers(maplayerid, name, layerdefinitions, isoverlay, icon, activated, addtomap)
   VALUES (public.uuid_generate_v1mc(), 'Hex', '[
      {
        "layout": {},
        "source": "search-results-hex",
        "filter": [
          "==",
          "id",
          ""
        ],
        "paint": {
          "fill-extrusion-color": "#54278f",
          "fill-extrusion-height": {
            "property": "doc_count",
            "type": "exponential",
            "stops": [
              [
                0,
                0
              ],
              [
                500,
                5000
              ]
            ]
          },
          "fill-extrusion-opacity": 0.85
        },
        "type": "fill-extrusion",
        "id": "search-results-hex-outline-highlighted"
      },
      {
        "layout": {},
        "source": "search-results-hex",
        "filter": [
          "all",
          [
            ">",
            "doc_count",
            0
          ]
        ],
        "paint": {
          "fill-extrusion-color": {
            "property": "doc_count",
            "stops": [
              [
                1,
                "#f2f0f7"
              ],
              [
                5,
                "#cbc9e2"
              ],
              [
                10,
                "#9e9ac8"
              ],
              [
                20,
                "#756bb1"
              ],
              [
                50,
                "#54278f"
              ]
            ]
          },
          "fill-extrusion-height": {
            "property": "doc_count",
            "type": "exponential",
            "stops": [
              [
                0,
                0
              ],
              [
                500,
                10000
              ]
            ]
          },
          "fill-extrusion-opacity": 0.5
        },
        "type": "fill-extrusion",
        "id": "search-results-hex"
      }

   ]', TRUE, 'ion-funnel', TRUE, FALSE);

DELETE FROM public.map_layers
   	WHERE name = 'streets';
    
INSERT INTO map_layers(maplayerid, name, layerdefinitions, isoverlay, icon, activated, addtomap)
        VALUES (public.uuid_generate_v1mc(), 'streets', '[
            {
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": "#dedede"
                }
            },
            {
                "id": "landuse_overlay_national_park",
                "type": "fill",
                "source": "mapbox-streets",
                "source-layer": "landuse_overlay",
                "filter": [
                    "==",
                    "class",
                    "national_park"
                ],
                "paint": {
                    "fill-color": "#d2edae",
                    "fill-opacity": 0.75
                }
            },
            {
                "id": "landuse_park",
                "type": "fill",
                "source": "mapbox-streets",
                "source-layer": "landuse",
                "filter": [
                    "==",
                    "class",
                    "park"
                ],
                "paint": {
                    "fill-color": "#d2edae"
                }
            },
            {
                "id": "waterway",
                "type": "line",
                "source": "mapbox-streets",
                "source-layer": "waterway",
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "LineString"
                    ],
                    [
                        "in",
                        "class",
                        "canal",
                        "river"
                    ]
                ],
                "paint": {
                    "line-color": "#a0cfdf",
                    "line-width": {
                        "base": 1.4,
                        "stops": [
                            [
                                8,
                                0.5
                            ],
                            [
                                20,
                                15
                            ]
                        ]
                    }
                }
            },
            {
                "id": "water",
                "type": "fill",
                "source": "mapbox-streets",
                "source-layer": "water",
                "paint": {
                    "fill-color": "#a0cfdf"
                }
            },
            {
                "layout": {},
                "paint": {
                    "fill-extrusion-color": "hsl(0, 0%, 78%)",
                    "fill-extrusion-height": {
                        "property": "height",
                        "type": "identity"
                    },
                    "fill-extrusion-base": 0,
                    "fill-extrusion-opacity": 0.4
                },
                "source": "sf_buildings",
                "source-layer": "sf_buildings",
                "type": "fill-extrusion",
                "id": "sf_buildings_3d",
                "minzoom": 16
            },
            {
                "id": "tunnel_minor",
                "type": "line",
                "source": "mapbox-streets",
                "source-layer": "road",
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "LineString"
                    ],
                    [
                        "all",
                        [
                            "==",
                            "structure",
                            "tunnel"
                        ],
                        [
                            "in",
                            "class",
                            "link",
                            "motorway_link",
                            "path",
                            "pedestrian",
                            "service",
                            "street",
                            "street_limited",
                            "track"
                        ]
                    ]
                ],
                "layout": {
                    "line-cap": "butt",
                    "line-join": "miter"
                },
                "paint": {
                    "line-color": "#efefef",
                    "line-width": {
                        "base": 1.55,
                        "stops": [
                            [
                                4,
                                0.25
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-dasharray": [
                        0.36,
                        0.18
                    ]
                }
            },
            {
                "id": "tunnel_major",
                "type": "line",
                "source": "mapbox-streets",
                "source-layer": "road",
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "LineString"
                    ],
                    [
                        "all",
                        [
                            "==",
                            "structure",
                            "tunnel"
                        ],
                        [
                            "in",
                            "class",
                            "motorway",
                            "primary",
                            "secondary",
                            "tertiary",
                            "trunk"
                        ]
                    ]
                ],
                "layout": {
                    "line-cap": "butt",
                    "line-join": "miter"
                },
                "paint": {
                    "line-color": "#fff",
                    "line-width": {
                        "base": 1.4,
                        "stops": [
                            [
                                6,
                                0.5
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-dasharray": [
                        0.28,
                        0.14
                    ]
                }
            },
            {
                "id": "sf_road_minor",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "5",
                    "6"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.55,
                        "stops": [
                            [
                                4,
                                0.25
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-color": "#efefef"
                }
            },
            {
                "id": "sf_road_major",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "2",
                    "3",
                    "4"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.35,
                        "stops": [
                            [
                                6,
                                0.5
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-color": "#fff"
                }
            },
            {
                "id": "sf_bridge_minor_case",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "6"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.55,
                        "stops": [
                            [
                                12,
                                0.5
                            ],
                            [
                                20,
                                34
                            ]
                        ]
                    },
                    "line-color": "#ccc"
                }
            },
            {
                "id": "sf_bridge_minor",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "6"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.55,
                        "stops": [
                            [
                                4,
                                0.25
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-color": "#efefef"
                }
            },
            {
                "id": "sf_bridge_major_case",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "1"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.4,
                        "stops": [
                            [
                                6,
                                0.5
                            ],
                            [
                                20,
                                34
                            ]
                        ]
                    },
                    "line-color": "#ddd999"
                }
            },
            {
                "id": "sf_bridge_major",
                "type": "line",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "1"
                ],
                "layout": {},
                "paint": {
                    "line-width": {
                        "base": 1.4,
                        "stops": [
                            [
                                6,
                                0.5
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    "line-color": "#fff"
                }
            },
            {
                "id": "admin_country",
                "type": "line",
                "source": "mapbox-streets",
                "source-layer": "admin",
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "LineString"
                    ],
                    [
                        "all",
                        [
                            "<=",
                            "admin_level",
                            2
                        ],
                        [
                            "==",
                            "maritime",
                            0
                        ]
                    ]
                ],
                "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                },
                "paint": {
                    "line-color": "#8b8a8a",
                    "line-width": {
                        "base": 1.3,
                        "stops": [
                            [
                                3,
                                0.5
                            ],
                            [
                                22,
                                15
                            ]
                        ]
                    }
                }
            },
            {
            	"layout": {
            		"line-join": "round",
            		"line-cap": "round"
            	},
            	"paint": {
            		"line-color": "#ccc",
            		"line-width": 2
            	},
            	"source": "sf_parcels",
            	"minzoom": 16,
            	"source-layer": "sf_parcels",
            	"type": "line",
            	"id": "sf_parcels"
            },
            {
              "layout": {
            		"text-font": [
            			"Open Sans Semibold",
            			"Arial Unicode MS Bold"
            		],
            		"text-field": "{blklot}",
            		"text-size": 11,
            		"text-max-width": 8
            	},
            	"paint": {
            		"text-halo-blur": 1,
            		"text-color": "#666",
            		"text-halo-width": 1,
            		"text-halo-color": "rgba(255,255,255,0.75)"
            	},
            	"source": "sf_parcels",
            	"minzoom": 16,
            	"source-layer": "sf_parcels",
            	"type": "symbol",
            	"id": "parcel_labels"
            },
            {
                "id": "poi_label",
                "type": "symbol",
                "source": "mapbox-streets",
                "source-layer": "poi_label",
                "minzoom": 5,
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "Point"
                    ],
                    [
                        "all",
                        [
                            "==",
                            "localrank",
                            1
                        ],
                        [
                            "==",
                            "scalerank",
                            1
                        ]
                    ]
                ],
                "layout": {
                    "icon-image": "{maki}-11",
                    "text-offset": [
                        0,
                        0.5
                    ],
                    "text-field": "{name_en}",
                    "text-font": [
                        "Open Sans Semibold",
                        "Arial Unicode MS Bold"
                    ],
                    "text-max-width": 8,
                    "text-anchor": "top",
                    "text-size": 11,
                    "icon-size": 1
                },
                "paint": {
                    "text-color": "#666",
                    "text-halo-width": 1,
                    "text-halo-color": "rgba(255,255,255,0.75)",
                    "text-halo-blur": 1
                }
            },
            {
                "id": "sf_road_minor_labels",
                "type": "symbol",
                "metadata": {},
                "minzoom": 12,
                "source": "sf_streets",
                "source-layer": "sf_streets",
                "filter": [
                    "in",
                    "classcode",
                    "",
                    "5",
                    "6"
                ],
                "layout": {
                    "text-field": "{streetname}",
                    "text-size": {
                        "base": 1.4,
                        "stops": [
                            [
                                12,
                                0
                            ],
                            [
                                14,
                                8
                            ],
                            [
                                22,
                                14
                            ]
                        ]
                    },
                    "symbol-placement": "line"
                },
                "paint": {
                    "text-color": "#454545",
                    "text-translate": [
                        0,
                        0
                    ]
                }
            },
            {
                "id": "road_major_label",
                "type": "symbol",
                "source": "mapbox-streets",
                "source-layer": "road_label",
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "LineString"
                    ],
                    [
                        "in",
                        "class",
                        "motorway",
                        "primary",
                        "secondary",
                        "tertiary",
                        "trunk"
                    ]
                ],
                "layout": {
                    "symbol-placement": "line",
                    "text-field": "{name_en}",
                    "text-font": [
                        "Open Sans Semibold",
                        "Arial Unicode MS Bold"
                    ],
                    "text-transform": "uppercase",
                    "text-letter-spacing": 0.1,
                    "text-size": {
                        "base": 1.4,
                        "stops": [
                            [
                                10,
                                8
                            ],
                            [
                                20,
                                14
                            ]
                        ]
                    }
                },
                "paint": {
                    "text-color": "#666",
                    "text-halo-color": "rgba(255,255,255,0.75)",
                    "text-halo-width": 2
                }
            },
            {
                "id": "place_label_other",
                "type": "symbol",
                "source": "mapbox-streets",
                "source-layer": "place_label",
                "minzoom": 8,
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "Point"
                    ],
                    [
                        "in",
                        "type",
                        "hamlet",
                        "island",
                        "neighbourhood",
                        "suburb",
                        "town",
                        "village"
                    ]
                ],
                "layout": {
                    "text-field": "{name_en}",
                    "text-font": [
                        "Open Sans Semibold",
                        "Arial Unicode MS Bold"
                    ],
                    "text-max-width": 6,
                    "text-size": {
                        "stops": [
                            [
                                6,
                                12
                            ],
                            [
                                12,
                                16
                            ]
                        ]
                    }
                },
                "paint": {
                    "text-color": "#666",
                    "text-halo-color": "rgba(255,255,255,0.75)",
                    "text-halo-width": 1,
                    "text-halo-blur": 1
                }
            },
            {
                "id": "place_label_city",
                "type": "symbol",
                "source": "mapbox-streets",
                "source-layer": "place_label",
                "maxzoom": 16,
                "filter": [
                    "all",
                    [
                        "==",
                        "$type",
                        "Point"
                    ],
                    [
                        "==",
                        "type",
                        "city"
                    ]
                ],
                "layout": {
                    "text-field": "{name_en}",
                    "text-font": [
                        "Open Sans Bold",
                        "Arial Unicode MS Bold"
                    ],
                    "text-max-width": 10,
                    "text-size": {
                        "stops": [
                            [
                                3,
                                12
                            ],
                            [
                                8,
                                16
                            ]
                        ]
                    }
                },
                "paint": {
                    "text-color": "#666",
                    "text-halo-color": "rgba(255,255,255,0.75)",
                    "text-halo-width": 1,
                    "text-halo-blur": 1
                }
            },
            {
                "id": "country_label",
                "type": "symbol",
                "source": "mapbox-streets",
                "source-layer": "country_label",
                "maxzoom": 12,
                "filter": [
                    "==",
                    "$type",
                    "Point"
                ],
                "layout": {
                    "text-field": "{name_en}",
                    "text-font": [
                        "Open Sans Regular",
                        "Arial Unicode MS Regular"
                    ],
                    "text-max-width": 10,
                    "text-size": {
                        "stops": [
                            [
                                3,
                                14
                            ],
                            [
                                8,
                                22
                            ]
                        ]
                    }
                },
                "paint": {
                    "text-color": "#666",
                    "text-halo-color": "rgba(255,255,255,0.75)",
                    "text-halo-width": 1,
                    "text-halo-blur": 1
                }
            }
        ]', FALSE, '', TRUE, TRUE);