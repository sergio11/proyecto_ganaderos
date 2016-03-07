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
		var timer = null;
		//Main PTZ Actions.
		$("#mainControls").on("mousedown","[data-control]",function(e){
			var cmd = this.dataset.control.toLowerCase();
			switch(cmd){
				case 'left':
				case 'right':

					if (cmd == 'left') {
						self._current.toLeft();
					}else{
						self._current.toRight();
					}

					timer = setInterval(function(){
						//notificamos operación
						self.triggerEvent('rotate-camera',cmd);
					},100);
	
				break;
				case 'up':
					self._current.toTop();
				break;
				case 'down':
					self._current.toBottom();
				break;
				case 'home':
					self._current.toHome();
				break;
			}
			
		}).on("mouseup","[data-control]",function(e){
			self._current.stop();
			clearInterval(timer);
		});

		//Other PTZ Actions.
		$("#otherControls").on("click","[data-control]",function(e){
			e.preventDefault();
			var cmd = this.dataset.control.toLowerCase();
			switch(cmd){
				case 'vscan':
					self._current.verticalScan();
				break;
				case 'hscan':
					self._current.horizontalScan();
				break;
				case 'hvstop':
					self._current.stopScan();
				break;
			}

		});


		$("#zoom").on("change",function(e){
			self.triggerEvent('camera-zoom',parseInt(this.value));
		});



	};


	return ControlPanel;

})(EventEmitter,window,jQuery);