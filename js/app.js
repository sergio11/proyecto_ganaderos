(function(w,$){

	$(function(){

		var $container = $("#container");
		var camera = new Camera();
		camera.showIn($container);
		camera.play();

		$("#controls").on("mousedown","[data-control]",function(e){
			var cmd = this.dataset.control.toLowerCase();
			switch(cmd){
				case 'left':
					camera.toLeft();
				break;
				case 'right':
					camera.toRight();
				break;
				case 'up':
					camera.toTop();
				break;
				case 'down':
					camera.toBottom();
				break;
			}
			
		});

		$("#controls").on("mouseup","[data-control]",function(e){
			camera.stop();
			
		});
		
		

	});


	//API de google maps cargada
	w.initMap = function(){

		var angle = 15;
		var target = document.getElementById('map');

		var data = {
			targets:[
				{
					latlng: new google.maps.LatLng(40.9259649395143, -5.3839874267578125),
					title: "Marker 1",
					content: "Contenido del Marker 1"
				},
				{
					latlng: new google.maps.LatLng(40.91351257612757,-5.6105804443359375),
					title: "Marker 2",
					content: "Contenido del Marker 2"
				},
				{
					latlng: new google.maps.LatLng(40.93841495689795,-5.7740020751953125),
					title: "Marker 3",
					content: "Contenido del Marker 3"
				},
				{
					latlng: new google.maps.LatLng(40.97575093157535,-5.6270599365234375),
					title: "Marker 4",
					content: "Contenido del Marker 4"
				}
			],
			current: new google.maps.LatLng(40.91351257612757,-5.6105804443359375),
			camera:new google.maps.LatLng(40.9669835,-5.695766700000001)
		}

		var map = new Map(data);

		map.load();

		var controls = document.querySelectorAll("[data-control]");
		controls.forEach(function(control){
			control.addEventListener("click",function(e){
				e.preventDefault();
				var control = this.dataset.control;
				map.rotatePolygon(control == "left" ? -angle : angle);
			});
		});
		
		document.getElementById("zoom").addEventListener("click",function(){
			console.log("Zoom Nuevo");
			console.log(this.value);
			map.setZoom(this.value);
		});

		console.log("Zoom Actual del Mapa");
		console.log(map.getZoom());

	}




})(window,jQuery);