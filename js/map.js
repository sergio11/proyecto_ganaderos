var Map = (function(_super,w){

	__extends(Map, _super);

	var zoom = 19;
	var default_center = {'lat':40.796331,'lng':-6.242278};
	var cow_icon = "img/cow-export.png";
	var camera_icon = "img/camera.png";
	
	function Map(cameras,cows){

		this._cameras = cameras;
		this._cows = cows;
		this._currentCamera = null;
		//Intanciamos mapa
		this._map = new google.maps.Map(document.getElementById('map'), {
		    center: new google.maps.LatLng(default_center.lat, default_center.lng),
		    zoom: zoom,
		    mapTypeId: google.maps.MapTypeId.SATELLITE,
		    draggable: true,
		    scrollwheel: false,
		    disableDefaultUI: true
		});
		//Instanciamos la InfoWindows.
		this._infowindow = new google.maps.InfoWindow();
		this._polygon = new google.maps.Polygon({
			strokeColor: '#DAA520',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#DAA520',
			fillOpacity: 0.35
		});
		
	}

	Map.prototype._createMarker = function(options) {

		var marker = new google.maps.Marker({
			position: options.latlng,
			animation: google.maps.Animation.DROP,
			title: options.title,
			icon: options.type == 'camera' ? camera_icon : cow_icon
		});

		setTimeout(function() {
			marker.setMap(this._map);
		}.bind(this), (Math.random() * 30) + 1 );

		return marker;
	};

	//Ajusta el mapa para dos puntos
	Map.prototype._fitMap = function(cords) {
		var bounds = new google.maps.LatLngBounds(this._currentCamera.getLatlng(), cords);
  		this._map.fitBounds(bounds);
	};

	//Une la infoWindows a un marker especificado.
	Map.prototype._attachInfoWindows= function(marker,body) {
		this._infowindow.close();
		this._infowindow.open(this._map, marker);
		var content = document.getElementById("content");
		content.querySelector(".body").textContent = body;
		this._infowindow.setContent(content);
	};

	//Manejador evento click sobre marker tipo cámara.
	Map.prototype._onClickCamera = function(camera) {
		this.setCamera(camera);
		
	};

	Map.prototype._onClickCow = function(cow) {
		if(!google.maps.geometry.poly.containsLocation(cow.marker.getPosition(), this._currentCamera.getArea())){
			this._cameras.forEach(function(camera){
				google.maps.geometry.poly.containsLocation(cow.marker.getPosition(), camera.getArea()) && this.setCamera(camera);
			}.bind(this));
		}
		this._setCurrentTarget(cow.marker.getPosition());
		this._attachInfoWindows(cow.marker,this._cows[cow.marker.idx].content);
	};



	Map.prototype._findNewTarget = function() {
		var marker = this.targets.find(function(target){
			if(google.maps.geometry.poly.containsLocation(target.latlng, this.polygon)){
				return target.marker;
			}
		}.bind(this));
		console.log("Target Obtenido");
		console.log(marker);
		console.log("Todos los targets");
		console.log(this.targets);
		marker && this._onChangeMarker(marker);
	};

	//Cambia Objetivo de la cámara
	Map.prototype._setCurrentTarget = function(target) {
		//Ajustamos viewport mapa
		this._fitMap(target);
		var camera = this._currentCamera.getLatlng();
		var radius = 0.1;
		var angle_offset =  360/18-180;
		var distancia = google.maps.geometry.spherical.computeDistanceBetween(camera, target);
		var angle = google.maps.geometry.spherical.computeHeading(camera, target);
 		var v1=new google.maps.geometry.spherical.computeOffsetOrigin(camera, distancia, angle+angle_offset);
 		var v2=new google.maps.geometry.spherical.computeOffsetOrigin(camera, distancia, angle-angle_offset);
	    //Establece path del polígono para que apunte al destino
	    this._polygon.setPath([camera,v1,v2,camera]);
		this._polygon.setMap(this._map);
	};

	//Establece el zoom del Mapa
	Map.prototype.setZoom = function(zoom) {
		!isNaN(parseInt(zoom)) && this._map.setZoom(parseInt(zoom));
	};

	//Devuelve el zoom Actual.
	Map.prototype.getZoom = function() {
		return this._map.getZoom();
	};

	//Cambia Cámara actual
	Map.prototype.setCamera = function(camera){
		//cerramos info windows
		this._infowindow.close();
		//ocultamos polígono proyección
		this._polygon.setMap(null);
		//ocultamos area activa.
		this._currentCamera && this._currentCamera.hideArea();
		//guardamos referencia a la nueva cámara activa
		this._currentCamera = camera;
		this._cameras.forEach(function(camera){
			camera.stopAnimateMarker();
		});
		this._currentCamera.animateMarker();
		this._map.setCenter(camera.getLatlng());
		camera.showAreaIn(this._map);
		
			
	}


	Map.prototype.load = function() {
		//Cargamos las cámaras
		for (var i =0, len = this._cameras.length; i < len; i++)
			(function(camera){
				var marker = this._createMarker({
					latlng: camera.getLatlng(),
					title: camera.getTitle(),
					type: 'camera'
				});
			    marker.idx = i;
			    marker.addListener('click',this._onClickCamera.bind(this,camera));
			    //Comprobamos si el target inicial coincide con el marker actual.
				/*if(this.current && marker.getPosition().equals(this.current)){
					this._onChangeMarker(marker);
				}*/
				
				camera.setMarker(marker);
			    
			}.bind(this))(this._cameras[i]);

		//Cargamos los objetivos
		for (var i =0, len = this._cows.length; i < len; i++)
			(function(cow){
				cow.latlng = new google.maps.LatLng(cow.coords.lat,cow.coords.lng);
				var marker = this._createMarker({
					latlng: cow.latlng,
					title: cow.title,
					type: 'cow'
				});
			    marker.idx = i;
			    marker.addListener('click',this._onClickCow.bind(this,cow));
			    //Comprobamos si el target inicial coincide con el marker actual.
				if(this.current && marker.getPosition().equals(this.current)){
					this._onClickCow(cow);
				}

				cow.marker = marker;
			    
			}.bind(this))(this._cows[i]);

		//Establecemos la cámara por defecto
		this.setCamera(this._cameras[0]);

	};


	//Rota el Polígono
	Map.prototype.rotatePolygon = function(angle) {
		if(angle){
			// Bounds
			//var strictBounds = new google.maps.LatLngBounds(this._currentCamera.getArea().getPath());
			this._polygon.rotate(angle, this._currentCamera.getLatlng());
			//buscamos nuevo objetivo
			//this._findNewTarget();
		}
	};
	
	

	return Map;

})(EventEmitter,window);
