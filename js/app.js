
(function(w,$){


	//Cameras.
	var cameras = [
		{
			'title': 'Cámara 1',
			'url': 'rtsp://212.128.156.124:554/live/ch0',
			'coords':{
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
			]
		},
		{
			'title': 'Cámara 2',
			'url': 'rtsp://212.128.156.124:554/live/ch0',
			'coords':{
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
			]
		},
		{
			'title': 'Cámara 3',
			'url': 'rtsp://212.128.156.124:554/live/ch0',
			'coords':{
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
			]
		}
	];

	var cows = [
		{ 
			'coords':{
				'lat': 40.796581,
				'lng': -6.242048
			},
			title: "Marker 1",
			content: "Contenido del Marker 1"
		},
		{
			'coords':{
				'lat': 40.796406,
				'lng': -6.241906
			},
			title: "Marker 2",
			content: "Contenido del Marker 2"
		},
		{
			'coords':{
				'lat': 40.796574,
				'lng': -6.242434
			},
			title: "Marker 3",
			content: "Contenido del Marker 3"
		},
		{
			'coords':{
				'lat': 40.796030,
				'lng': -6.242104
			},
			title: "Marker 4",
			content: "Contenido del Marker 4"
		},
		{
			'coords':{
				'lat': 40.795747,
				'lng': -6.242578
			},
			title: "Marker 5",
			content: "Contenido del Marker 5"
		},
		{
			'coords':{
				'lat': 40.796352,
				'lng': -6.243132
			},
			title: "Marker 6",
			content: "Contenido del Marker 6"
		}
	];

	var angle = 15;
	//Google MAPS API loaded
	w.initMap = function(){

		//Instanciamos cámaras.
		cameras = cameras.map(function(data){
			return new Camera(data);
		});

		//Instanciamos el mapa.
		var map = new Map(cameras,cows);
		map.load();

		var controlPanel = new ControlPanel(cameras);
		//Implementamos manejadores.
		controlPanel.addEventListener('camera-zoom',function(e){
			map.setZoom(e.value);
		});
		controlPanel.addEventListener('change-camera',function(i){
			console.log("índice de la cámara actual : " + i);
			map.setCamera(i);
		});

		controlPanel.addEventListener('rotate-camera',function(direction){
			map.rotatePolygon(direction == "left" ? -angle : angle);
		});

		//Inicio panel de control.
		controlPanel.init();
		


	}


})(window,jQuery);