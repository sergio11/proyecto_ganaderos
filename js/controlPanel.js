var ControlPanel = (function(_super,w,$){

	__extends(ControlPanel, _super);

	function ControlPanel(cameras){
		this._cameras = cameras;
		this._current = 0;
		this._$container = $("#container");
		this.events = {
			'rotate-camera':[],
			'camera-zoom':[],
			'change-camera': []
		}
	}

	ControlPanel.prototype.init = function() {

		//Instanciamos cámaras.
		this._cameras = this._cameras.map(function(data){
			return new Camera(data);
		});

		//Activamos por defecto la primera cámara
		this._cameras[this._current].showIn(this._$container);
		//Notificamos cambio de cámara
		this.triggerEvent('change-camera',this._current);

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

		
	
	};

	

	return ControlPanel;

})(EventEmitter,window,jQuery);