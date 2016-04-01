var ControlPanel = (function (_super, w, $) {

    __extends(ControlPanel, _super);

    function ControlPanel(cameras) {
        this._cameras = cameras;
        this._current = null;
        this._$container = $("#container");
        this._currentPreset = 4;
        this._intervalPreset = 5625;
        this._usingVLC = false;
        this.events = {
            'rotate-camera': [],
            'camera-zoom': [],
            'change-camera': [],
            'change-preset': []
        }
    }

    ControlPanel.prototype.init = function () {

        if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1 && w.confirm("¿Usar Componente VLC para visualizar los Vídeos?")) {
            this._usingVLC = true;
        }

        var $overlay = $("#overlay");
        $(".overlay-close", $overlay).on("click", function (e) {
            e.preventDefault();
            $overlay.removeClass("active");
            $("#player").fadeIn(1000);

        });

        //load cameras
        this._loadCameras();

        //this._current._scanPreset();
        //Funcionalidad para los controles.
        var self = this, timer = null;
        //Main PTZ Actions.
        $("#mainControls").on("mousedown", "[data-control]", function (e) {
            if (!self._current.isMove()) {
                var cmd = this.dataset.control.toLowerCase();
                timer && clearInterval(timer);
                switch (cmd) {
                    case 'left':
                    case 'right':

                        if (cmd == 'left') {
                            self._current.toLeft();
                        } else {
                            self._current.toRight();
                        }

                        timer = setInterval(function () {
                            //notificamos operación
                            self.triggerEvent('rotate-camera', cmd);
                        }, 100);

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
                self._current.setIsMove(true);
            } else {
                swal("La cámara se encuentra en movimiento");
            }

        }).on("mouseup click", "[data-control]", function (e) {
            self._current.stop();
            clearInterval(timer);
            self._current.setIsMove(false);
        });

        //Other PTZ Actions.
        $("#otherControls").on("click", "[data-control]", function (e) {
            e.preventDefault();
            var cmd = this.dataset.control.toLowerCase();
            switch (cmd) {
                case 'vscan':
                    self._current.verticalScan();
                    self._current.setIsMove(true);
                    break;
                case 'hscan':
                    self._current.horizontalScan();
                    self._current.setIsMove(true);
                    break;
                case 'hvstop':
                    self._current.stopScan();
                    self._current.setIsMove(false);
                    break;
            }

        });

        //Reset Presets.
        $("#resetPresets").on("click", function (e) {
            e.preventDefault();
            //hide cameras.
            this._cameras.forEach(function (camera) { camera.hide() });
            console.log("Init Scan ...");
            $overlay.addClass("active");
            $("#presets").empty();
            this._current.scanPreset();
            //Scan Finished Handler
            this._current.addEventListener("scan-finished", function () {
                this._createPresetsBar();
                var zones = this._current.getCountZones();
                var preset = Math.round(zones / 2);
                //active preset.
                this.activePreset(preset);
                this._current.setIsMove(true);
                $overlay.removeClass("active");
                setTimeout(function () {
                    this._current.setIsMove(false);
                } .bind(this), 45 / zones * preset * 1000);
            } .bind(this), true);

        } .bind(this));

        //Zoom Control
        $("#zoom").on("change", function (e) {
            self.triggerEvent('camera-zoom', parseInt(this.value));
        });

        var self = this;
        $("#presets").on("click", "[data-preset]", function (e) {
            e.preventDefault();
            if (!self._current.isMove()) {
                var preset = this.dataset.preset;
                var $this = $(this);
                if (!$this.hasClass("active")) {
                    $this.addClass("active");
                    self.activePreset(preset);
                }
            } else {
                swal("La cámara se encuentra en movimiento");
            }

        });

        //change cámara
        $("#others-cameras").on("click", "[data-camera]", function (e) {
            e.preventDefault();
            var id = this.id;
            var camera = self._cameras.find(function (camera) {
                return camera.id == id;
            });
            self.triggerEvent("change-camera", camera);
            self.setCurrentCamera(camera);
        })

    };

    //create presets bar
    ControlPanel.prototype._createPresetsBar = function () {
        console.log("Scan Finalizado ...");
        var presets = this._current.getPresets();
        var $fragment = $(document.createDocumentFragment());
        for (var i = 0; i < presets.length; i++) {
            $fragment.append(
                $("<li>", { 'class': 'preset' }).append(
                    $("<a>", { 'text': presets[i].id, 'href': '#', 'data-preset': presets[i].id })
                )
            );
        }
        $("#presets").append($fragment);
    }

    //load cameras.
    ControlPanel.prototype._loadCameras = function () {
        //Activamos por defecto la primera cámara
        this._current = this._cameras[0];
        this._current.showIn(this._$container, { width: 640, height: 480 }, this._usingVLC, [
                { 'name': 'controls', 'value': 'true' },
                { 'name': 'allowfullscreen', 'value': 'true' }
        ]);

        var $cameras = $("#others-cameras");
        this._cameras.forEach(function (camera) {
            camera.showThumbnailsIn($cameras);
        } .bind(this));
    }

    //Return current Camera.
    ControlPanel.prototype.getCurrentCamera = function () {
        return this._current;
    }

    //Set Current Camera
    ControlPanel.prototype.setCurrentCamera = function (camera) {
        this._current = camera;
    }

    //Active Preset
    ControlPanel.prototype.activePreset = function (number) {

        $("#presets").find("[data-preset]").removeClass("active").eq(number - 1).addClass("active");
        this._current.goPreset(number);
        this._current.setIsMove(true);
        setTimeout(function () {
            console.log("Move Finished ...");
            //save current preset
            this._currentPreset = number;
            this._current.setIsMove(false);
        } .bind(this), Math.abs((this._currentPreset * this._intervalPreset) - (number * this._intervalPreset)));
        //notificamos evento
        this.triggerEvent('change-preset', number);
    }

    return ControlPanel;

})(EventEmitter, window, jQuery);