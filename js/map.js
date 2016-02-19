var Map = (function(_super,w){

	__extends(Map, _super);

	var zoom = 19;
	var default_center = {'lat':40.796331,'lng':-6.242278};
	var cow_icon = "img/cow-export.png";
	var camera_icon = "img/camera.png";
	
	function Map(cameras,cows){

		this._cameras = cameras;
		this._cows = cows;

		this._map = new google.maps.Map(document.getElementById('map'), {
		    center: new google.maps.LatLng(default_center.lat, default_center.lng),
		    zoom: zoom,
		    mapTypeId: google.maps.MapTypeId.SATELLITE,
		    draggable: true,
		    scrollwheel: false,
		    disableDefaultUI: true
		});

		this._infowindow = new google.maps.InfoWindow();
		this._polygon = new google.maps.Polygon({
			strokeColor: '#DAA520',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#DAA520',
			fillOpacity: 0.35
		});
		
	}

	Map.prototype._createMarkerFor = function(elem,icon) {
		var marker = new google.maps.Marker({
			position: elem.latlng,
			animation: google.maps.Animation.DROP,
			title: elem.title,
			icon:icon
		});

		setTimeout(function() {
			marker.setMap(this._map);
		}.bind(this), (Math.random() * 30) + 1 );

		return marker;
	};

	//Ajusta el mapa para dos puntos
	Map.prototype._fitMap = function(cords) {
		var bounds = new google.maps.LatLngBounds(this.camera, cords);
  		this.map.fitBounds(bounds);
	};

	//Cambia Objetivo de la cámara
	Map.prototype._setCurrentTarget = function(target) {
		//Ajustamos viewport mapa
		this._fitMap(target);
		var radius = 0.1;
		var angle_offset =  360/18-180;
		var distancia = google.maps.geometry.spherical.computeDistanceBetween(this.camera, target);
		var angle = google.maps.geometry.spherical.computeHeading(this.camera, target);
 		var v1=new google.maps.geometry.spherical.computeOffsetOrigin(this.camera, distancia, angle+angle_offset);
 		var v2=new google.maps.geometry.spherical.computeOffsetOrigin(this.camera, distancia, angle-angle_offset);
	    this.polygon.setPath([this.camera,v1,v2,this.camera]);
		this.polygon.setMap(this.map);
	};

	//Une la infoWindows a un marker especificado.
	Map.prototype._attachInfoWindows= function(marker,body) {
		this.infowindow.close();
		this.infowindow.open(this.map, marker);
		var content = document.getElementById("content");
		content.querySelector(".body").textContent = body;
		this.infowindow.setContent(content);
	};

	Map.prototype._onChangeMarker = function(marker) {
		if(this.currentMarker != marker){
			this.currentMarker && this.currentMarker.setAnimation(null);
			marker.setAnimation(google.maps.Animation.BOUNCE);
			this.currentMarker = marker;
			this._setCurrentTarget(marker.getPosition());
			this._attachInfoWindows(marker,this.targets[marker.idx].content);
		}
	};

	Map.prototype._findNewTarget = function() {
		console.log("Buscando nuevo objetivo");
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

	Map.prototype.load = function() {
		//Cargamos las cámaras
		for (var i =0, len = this._cameras.length; i < len; i++)
			(function(camera){
				camera.latlng = new google.maps.LatLng(camera.coords.lat,camera.coords.lng);
				var marker = this._createMarkerFor(camera,camera_icon);
			    marker.idx = i;
			    /*marker.addListener('click',this._onChangeMarker.bind(this,marker));
			    //Comprobamos si el target inicial coincide con el marker actual.
				if(this.current && marker.getPosition().equals(this.current)){
					this._onChangeMarker(marker);
				}*/
				
				camera.marker = marker;
			    
			}.bind(this))(this._cameras[i]);

		//Cargamos los objetivos
		for (var i =0, len = this._cows.length; i < len; i++)
			(function(cow){
				cow.latlng = new google.maps.LatLng(cow.coords.lat,cow.coords.lng);
				var marker = this._createMarkerFor(cow,cow_icon);
			    marker.idx = i;
			    marker.addListener('click',this._onChangeMarker.bind(this,marker));
			    //Comprobamos si el target inicial coincide con el marker actual.
				if(this.current && marker.getPosition().equals(this.current)){
					this._onChangeMarker(marker);
				}

				cow.marker = marker;
			    
			}.bind(this))(this._cows[i]);

	};

	Map.prototype.setCamera = function(i){
		this._cameras[i] && this._map.setCenter(this._cameras[i].latlng);
	}
	//Rota el Polígono
	Map.prototype.rotatePolygon = function(angle) {
		if(angle){
			this.polygon.rotate(angle, this.camera);
			//buscamos nuevo objetivo
			this._findNewTarget();
		}
	};
	
	//Establece el zoom del Mapa
	Map.prototype.setZoom = function(zoom) {
		!isNaN(parseInt(zoom)) && this.map.setZoom(parseInt(zoom));
	};

	//Devuelve el zoom Actual.
	Map.prototype.getZoom = function() {
		return this.map.getZoom();
	};

	return Map;

})(EventEmitter,window);
