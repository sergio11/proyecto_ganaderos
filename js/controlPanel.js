var ControlPanel = (function (_super, w, $) {

    __extends(ControlPanel, _super);

    function ControlPanel(cameras) {
        this._cameras = cameras;
        this._current = 1;
        this._$container = $("#container");
        this.events = {
            'rotate-camera': [],
            'camera-zoom': [],
            'change-camera': [],
            'change-preset': []
        }
    }

    ControlPanel.prototype.init = function () {

        var $overlay = $("#overlay");
        $(".overlay-close", $overlay).on("click", function (e) {
            e.preventDefault();
            $overlay.removeClass("active");
            $("#player").fadeIn(1000);

        });

        //Activamos por defecto la primera cámara
        this._current = this._cameras[1];
        this._current.showIn(this._$container);
        //vlc.playlist.play();
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
                console.log("La Cámara se está moviendo");
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
            console.log("Init Scan ...");
            $("#player").fadeOut(1000, function () {
                $overlay.addClass("active");
                $("#presets").empty();
                this._current.scanPreset();
            } .bind(this));
            //Scan Finished Handler
            this._current.addEventListener("scan-finished", function () {
                this._createPresetsBar();
                $overlay.removeClass("active");
                $("#player").fadeIn(1000);

            } .bind(this), true);

        } .bind(this));

        //Zoom Control
        $("#zoom").on("change", function (e) {
            self.triggerEvent('camera-zoom', parseInt(this.value));
        });



        var self = this, currentPreset = 4, intervalPreset = 5625;
        $("#presets").on("click", "[data-preset]", function (e) {
            console.log("Preset Pulsado ....");
            console.log(e);
            e.preventDefault();
            if (!self._current.isMove()) {
                var preset = this.dataset.preset;
                var $this = $(this);
                if (!$this.hasClass("active")) {
                    self._current.goPreset(preset);
                }
            } else {
                console.log("La cámara se está moviendo");
            }

        });

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

    //Return current Camera.
    ControlPanel.prototype.getCurrentCamera = function () {
        return this._current;
    }

    //Active Preset
    ControlPanel.prototype.activePreset = function (number) {

        $("#presets").find("[data-preset]").removeClass("active").eq(number - 1).addClass("active");
        this._current.goPreset(number);
    }

    return ControlPanel;

})(EventEmitter, window, jQuery);