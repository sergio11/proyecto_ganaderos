var Camera = (function(w,$){

	//Camera Constructor
	function Camera(options){
		this._title = options.title;
		this._url = options.url;
		this._latlngPlain = options.coords;
		this._latlng = new google.maps.LatLng(options.coords.lat,options.coords.lng);
		this._area = new google.maps.Polygon({
			paths: options.area,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.15,
			draggable: false,
			geodesic: true
		});
		this._timer = null;
		this._content = null;
		this._areaPolygon = null;
		this._marker = null;
	}

	//Getters and Setters
	Camera.prototype.getTitle = function() {
		return this._title;
	};

	Camera.prototype.getLatlng = function() {
		return this._latlng;
	};

	Camera.prototype.getLatlngPlain = function() {
		return this._latlngPlain;
	};

	Camera.prototype.setMarker = function(marker) {
		this._marker = marker;
	};

	Camera.prototype.getMarker = function() {
		return this._marker;
	};

	Camera.prototype.getArea = function() {
		return this._area;
	};

	//Send PTZ Command to Proxy
	Camera.prototype._ptzCmdSubmit = function(command) {
		$.get("./ptzCtrlProxy.php",{
			'act': command
		});			
	};

	Camera.prototype._showNextImage = function() {
		$.getJSON("./stream_2.php").done(function(image){
			this._content.attr('src',image.dataUri)
		}.bind(this)).fail(function(err){
			console.log("Fallo al obtener la imagen");
			console.log(err);
		});
	};


	//PTZ Controls
	Camera.prototype.toLeft = function() {
		this._ptzCmdSubmit('left');
	};

	Camera.prototype.toRight = function() {
		this._ptzCmdSubmit('right');
	};

	Camera.prototype.toTop = function() {
		this._ptzCmdSubmit('up');
	};

	Camera.prototype.toBottom = function() {
		this._ptzCmdSubmit('down');
	};

	Camera.prototype.stop = function() {
		this._ptzCmdSubmit('stop');
	};

	Camera.prototype.showIn = function($target) {
		if(!this._content){
			if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
				this._content = $("<img>",{'width':640,'height':480});
			}else{
				if(w.confirm("¿Usar Componente VLC para visualizar Vídeo?")){
					this._content = $("<object>").append(
						$("<param>",{'name':'movie','value': this._url}),
						$("<embed>",{'type':'application/x-vlc-plugin','name':'video1','autoplay':'no','loop':'no','width':640,'height':480,'target':this._url})
					)
				}else{
					this._content = $("<img>",{'width':640,'height':480});
				}
			}
		}
		this._content.appendTo($target);
	};

	Camera.prototype.showAreaIn = function(map) {
		this._area.setMap(map);
	};

	Camera.prototype.hideArea = function() {
		this._area && this._area.setMap(null);
	};

	Camera.prototype.animateMarker = function() {
		this._marker && this._marker.setAnimation(google.maps.Animation.BOUNCE);
	};

	Camera.prototype.stopAnimateMarker = function() {
		this._marker && this._marker.setAnimation(null);
	};


	Camera.prototype.play = function() {
		if(this._content.get(0) instanceof HTMLImageElement){
			//configuramos el timer.
			this._timer = setInterval(this._showNextImage.bind(this),330);
		}
		
	};


	return Camera;


})(window,jQuery);
