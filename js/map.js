var Map = (function(w){

	var zoom = 10;
	var icon = "img/cow-export.png";
	
	function Map(options){

		this.map = new google.maps.Map(document.getElementById('map'), {
		    center: this.camera,
		    zoom: zoom,
		    mapTypeId: google.maps.MapTypeId.TERRAIN,
		    draggable: true,
		    scrollwheel: false,
		    disableDefaultUI: true
		});

		this.targets = options.targets;
		this.current = options.current;
		this.camera = options.camera;
		this.infowindow = new google.maps.InfoWindow();
		this.polygon = new google.maps.Polygon({
			strokeColor: '#DAA520',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#DAA520',
			fillOpacity: 0.35
		});
		this.currentMarker;
		
	}
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
		var map = this.map;
		for (var i =0, len = this.targets.length; i < len; i++)
			(function(target){
				var marker = new google.maps.Marker({
				    position: target.latlng,
				    animation: google.maps.Animation.DROP,
				    title: target.title,
				    icon:icon
				});

				setTimeout(function() {
			      marker.setMap(map);
			    }, i * 200);
			    marker.idx = i;
			    marker.addListener('click',this._onChangeMarker.bind(this,marker));
			    //Comprobamos si el target inicial coincide con el marker actual.
				if(this.current && marker.getPosition().equals(this.current)){
					this._onChangeMarker(marker);
				}

				target.marker = marker;
			    
			}.bind(this))(this.targets[i]);
	};



	Map.prototype.setCamera = function(cords){
		cords && this.map.setCenter(cords);
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

})(window);
