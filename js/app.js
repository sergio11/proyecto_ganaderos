
(function (w, $) {

    //Cameras.
    var cameras = [
        {
		    'id': 1,
		    'title': 'Cámara 1',
		    'ip': '212.128.154.128',
		    'coords': {
		        'lat': 40.795728,
		        'lng': -6.242950
		    },
		    'area': [
				{
				    'lat': 40.795728,
				    'lng': -6.242950
				},
				{
				    'lat': 40.795548,
				    'lng': -6.242792
				},
				{
				    'lat': 40.795781,
				    'lng': -6.242253
				},
				{
				    'lat': 40.795970,
				    'lng': -6.242492
				},
				{
				    'lat': 40.795728,
				    'lng': -6.242950
				}
			],
		    'zones': [
		        [
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            },
                    {
                        'lat': 40.79554994524119,
                        'lng': -6.242792531847954
                    },
                    {
                        'lat': 40.79558751049952,
                        'lng': -6.242710724473
                    },
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            }
               ],
               [
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            },
                    {
                        'lat': 40.79558751049952,
                        'lng': -6.242710724473
                    },
                    {
                        'lat': 40.79564030488069,
                        'lng': -6.2425873428583145
                    },
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            }
               ],
               [
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            },
                    {
                        'lat': 40.79564030488069,
                        'lng': -6.2425873428583145
                    },
                    {
                        'lat': 40.795730664397205,
                        'lng': -6.2423767894506454
                    },
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            }
               ],
               [
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            },
                    {
                        'lat': 40.795730664397205,
                        'lng': -6.2423767894506454
                    },
                    {
                        'lat': 40.79578296688767,
                        'lng': -6.242254727544605
                    },
                    {
                        'lat': 40.79584234452855,
                        'lng': -6.242333874106407
                    },
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            }
               ],
               [
		            {
		                'lat': 40.795733,
		                'lng': -6.242944
		            },
                    {
                        'lat': 40.79584234452855,
                        'lng': -6.242333874106407
                    },
                    {
                        'lat': 40.79590326088466,
                        'lng': -6.242410317063332
                    },
                    {
                        'lat': 40.795733,
                        'lng': -6.242944
                    }
                ],
                [
                    {
                        'lat': 40.795733,
                        'lng': -6.242944
                    },
                    {
                        'lat': 40.79590326088466,
                        'lng': -6.242410317063332
                    },
                    {
                        'lat': 40.79594324328169,
                        'lng': -6.242457423167366
                    },
                    {
                        'lat': 40.795733,
                        'lng': -6.242944
                    }
                ],
                [
                    {
                        'lat': 40.795733,
                        'lng': -6.242944
                    },
                    {
                        'lat': 40.79594324328169,
                        'lng': -6.242457423167366
                    },
                    {
                        'lat': 40.79596620772723,
                        'lng': -6.242489442229271
                    },
                    {
                        'lat': 40.795733,
                        'lng': -6.242944
                    }
                ]
		    ]
		},
		{
		    'id': 2,
		    'title': 'Cámara 2',
		    'ip': '212.128.157.227',
		    'coords': {
		        'lat': 40.796053,
		        'lng': -6.242559
		    },
		    'area': [
				{
				    'lat': 40.796053,
				    'lng': -6.242559
				},
				{
				    'lat': 40.796566,
				    'lng': -6.242636
				},
				{
				    'lat': 40.797076,
				    'lng': -6.241637
				},
				{
				    'lat': 40.796768,
				    'lng': -6.241316
				},
				{
				    'lat': 40.796442,
				    'lng': -6.241644
				},
				{
				    'lat': 40.796158,
				    'lng': -6.241365
				},
				{
				    'lat': 40.795878,
				    'lng': -6.241990
				},
				{
				    'lat': 40.796053,
				    'lng': -6.242559
				}
			],
		    'zones': [
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.796566230279026,
                        'lng': -6.242634281516075
                    },
                    {
                        'lat': 40.796615978098224,
                        'lng': -6.2425363808870316
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }

                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.796615978098224,
                        'lng': -6.2425363808870316
                    },
                    {
                        'lat': 40.796719534663545,
                        'lng': -6.242331191897392
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }

                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.796719534663545,
                        'lng': -6.242331191897392
                    },
                    {
                        'lat': 40.79707421256274,
                        'lng': -6.241635416287522
                    },
                    {
                        'lat': 40.79706687932796,
                        'lng': -6.241627747516986
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }

                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.79706687932796,
                        'lng': -6.241627747516986
                    },
                    {
                        'lat': 40.79676818988339,
                        'lng': -6.241316723865907
                    },
                    {
                        'lat': 40.79676818988339,
                        'lng': -6.241316723865907
                    },
                    {
                        'lat': 40.796443423178154,
                        'lng': -6.241642805778497
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }
                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.796443423178154,
                        'lng': -6.241642805778497
                    },
                    {
                        'lat': 40.79615866312614,
                        'lng': -6.241365487245048
                    },
                    {
                        'lat': 40.7961150493912,
                        'lng': -6.241460897249681
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }
                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.7961150493912,
                        'lng': -6.241460897249681
                    },
                    {
                        'lat': 40.79593981373968,
                        'lng': -6.241852024168452
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }
                ],
                [
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    },
                    {
                        'lat': 40.79593981373968,
                        'lng': -6.241852024168452
                    },
                    {
                        'lat': 40.79588295543884,
                        'lng': -6.2419892102479935
                    },
                    {
                        'lat': 40.796053,
                        'lng': -6.242559
                    }
                ]
            ]
		},
		{
		    'id': 3,
		    'title': 'Cámara 3',
		    'ip': '212.128.154.128',
		    'coords': {
		        'lat': 40.796114,
		        'lng': -6.242665
		    },
		    'area': [
				{
				    'lat': 40.796114,
				    'lng': -6.242665
				},
				{
				    'lat': 40.796575,
				    'lng': -6.242641
				},
				{
				    'lat': 40.796837,
				    'lng': -6.242902
				},
				{
				    'lat': 40.796393,
				    'lng': -6.243674
				},
				{
				    'lat': 40.795912,
				    'lng': -6.243233
				},
				{
				    'lat': 40.796114,
				    'lng': -6.242665
				}
			],
		    'zones': [

                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.796573865365616,
                        'lng': -6.242641730318155
                    },
                    {
                        'lat': 40.79669290310861,
                        'lng': -6.242758524536157
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.79669290310861,
                        'lng': -6.242758524536157
                    },
                    {
                        'lat': 40.79683559990478,
                        'lng': -6.242900140007919
                    },
                    {
                        'lat': 40.79677029762675,
                        'lng': -6.24301515519619
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.79677029762675,
                        'lng': -6.24301515519619
                    },
                    {
                        'lat': 40.796605825485074,
                        'lng': -6.243302151560783
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.796605825485074,
                        'lng': -6.243302151560783
                    },
                    {
                        'lat': 40.7964484597829,
                        'lng': -6.243572384119034
                    },
                    {
                        'lat': 40.79637333021935,
                        'lng': -6.243652179837227
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.79637333021935,
                        'lng': -6.243652179837227
                    },
                    {
                        'lat': 40.79609210123334,
                        'lng': -6.243392005562782
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.79609210123334,
                        'lng': -6.243392005562782
                    },
                    {
                        'lat': 40.79597636043819,
                        'lng': -6.2432873994112015
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ],
                [
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    },
                    {
                        'lat': 40.79597636043819,
                        'lng': -6.2432873994112015
                    },
                    {
                        'lat': 40.795916459421115,
                        'lng': -6.243231073021889
                    },
                    {
                        'lat': 40.796114,
                        'lng': -6.242665
                    }
                ]



            ]
		}
	];

    var cows = [
		{
		    'coords': {
		        'lat': 40.796581,
		        'lng': -6.242048
		    },
		    title: "Marker 1",
		    content: "Contenido del Marker 1"
		},
		{
		    'coords': {
		        'lat': 40.796406,
		        'lng': -6.241906
		    },
		    title: "Marker 2",
		    content: "Contenido del Marker 2"
		},
		{
		    'coords': {
		        'lat': 40.796574,
		        'lng': -6.242434
		    },
		    title: "Marker 3",
		    content: "Contenido del Marker 3"
		},
		{
		    'coords': {
		        'lat': 40.796030,
		        'lng': -6.242104
		    },
		    title: "Marker 4",
		    content: "Contenido del Marker 4"
		},
		{
		    'coords': {
		        'lat': 40.795747,
		        'lng': -6.242578
		    },
		    title: "Marker 5",
		    content: "Contenido del Marker 5"
		},
		{
		    'coords': {
		        'lat': 40.796352,
		        'lng': -6.243132
		    },
		    title: "Marker 6",
		    content: "Contenido del Marker 6"
		}
	];

    var angle = 15;
    //Google MAPS API loaded
    w.initMap = function () {

        $.getScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js", function () {
            //Instanciamos cámaras.
            cameras = cameras.map(function (data) {
                return new Camera(data);
            });
            //Instanciamos el mapa.
            var map = new Map(cameras, cows);
            var controlPanel = new ControlPanel(cameras);


            map.load();
            map.addEventListener('change-zone', function (zone) {
                controlPanel.activePreset(zone.idx);
            });

            map.addEventListener('change-camera', function (camera) {
                //change camera in control panel.
                controlPanel.setCurrentCamera(camera);
            });


            //Implementamos manejadores.
            controlPanel.addEventListener('camera-zoom', function (zoom) {
                console.log("zoom");
                console.log(zoom);
                map.setZoom(zoom);
            });

            controlPanel.addEventListener('change-camera', function (camera) {
                //change camera in map
                map.setCamera(camera);
            });

            controlPanel.addEventListener('change-preset', function (preset) {
                console.log("change-preset ... " + preset);
                var zones = controlPanel.getCurrentCamera().getZones();
                map.activeZone(zones.find(function (zone) {
                    return zone.idx == preset;
                }));
            });

            controlPanel.addEventListener('rotate-camera', function (direction) {
                map.rotatePolygon(direction);
            });

            //Inicio panel de control.
            controlPanel.init();

        });
    }


})(window, jQuery);