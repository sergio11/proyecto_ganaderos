var Camera = (function(w,$){

	//Camera Constructor
	function Camera(options){
		this._title = options.title;
		this._latlng = options.latlng;
		this._area = options.area;
		this._timer = null;
		this._content = null;
	}

	//Send PTZ Command to Proxy
	Camera.prototype._ptzCmdSubmit = function(command) {
		$.get("./ptzCtrlProxy.php",{
			'act': command
		});			
	};


	//
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
						$("<param>",{'name':'movie','value':'rtsp://212.128.154.211:554/live/ch0'}),
						$("<embed>",{'type':'application/x-vlc-plugin','name':'video1','autoplay':'no','loop':'no','width':640,'height':480,'target':'rtsp://212.128.154.211:554/live/ch0'})
					)
				}else{
					this._content = $("<img>",{'width':640,'height':480});
				}
			}
		}
		this._content.appendTo($target);
	};

	Camera.prototype.play = function() {
		if(this._content.get(0) instanceof HTMLImageElement){
			//configuramos el timer.
			this._timer = setInterval(this._showNextImage.bind(this),330);
		}
		
	};


	return Camera;


})(window,jQuery);
