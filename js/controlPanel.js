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
		//Activamos por defecto la primera cámara
		this._current = this._cameras[this._current];
		this._current.showIn(this._$container);
		//Funcionalidad para los controles.
		var self = this;
		$("#controls").on("mousedown","[data-control]",function(e){
			var cmd = this.dataset.control.toLowerCase();
			switch(cmd){
				case 'left':
				case 'right':
					if (cmd == 'left') {
						self._current.toLeft();
					}else{
						self._current.toRight();
					}
					//notificamos operación
					self.triggerEvent('rotate-camera',cmd);
					
					
				break;
				case 'up':
					self._current.toTop();
				break;
				case 'down':
					self._current.toBottom();
				break;
			}
			
		}).on("mouseup","[data-control]",function(e){
			self._current.stop();
		});

	};


	return ControlPanel;

})(EventEmitter,window,jQuery);