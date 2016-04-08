var ControlPanel = (function (_super, w, $) {

    __extends(ControlPanel, _super);

    function ControlPanel(cameras) {
        this._cameras = cameras;
        this._current = null;
        this._$container = $("#container");
        this._$othersCameras = $("#others-cameras");
        this._intervalPreset = 5625;
        this._vlc = null;
        this.events = {
            'rotate-camera': [],
            'camera-zoom': [],
            'change-camera': [],
            'change-preset': []
        }
    }

    ControlPanel.prototype.init = function () {

        if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1 && w.confirm("¿Usar Componente VLC para visualizar los Vídeos?")) {
            this._vlc = document.getElementById('vlc');
            //vlc events handler
            this._vlc.addEventListener('MediaPlayerEncounteredError', function (e) {
                console.log("Error : ", e);
            }, false);

            this._vlc.addEventListener('MediaPlayerPlaying', function (e) {
                console.log("Media Player is playing ...");
            }, false);
        } else {
            this._$container.empty().append($("<img>", { 'width': 640, 'height': 480 }));
            //configuramos el timer.
            //this._timer = setInterval(this._showNextImage.bind(this), 330);

        }

        var $overlay = $("#overlay");

        //show thumbnails
        this._cameras.forEach(function (camera) {

            var $figure = $("<figure>", { 'data-id': camera.getId(), 'data-camera': true, 'class': 'camera-screenshot' })
                .append(
                    $("<img>", { 'src': './img/loader.gif', 'width': 170, 'height': 170, 'title': camera.getTitle() }),
                    $("<figcaption>", { 'text': camera.getTitle() })
                ).appendTo(this._$othersCameras);

            camera.takeSnapshot().done(function (response) {
                $("img", $figure).attr('src', response.dataUri);
            }).fail(function () {
                console.log("Fail ........");
                $("img", $figure).attr('src', './img/no-video.png');
            });

            camera.addEventListener('change-preset', this.activePreset);

        } .bind(this));

        //set init camera
        this.setCurrentCamera(this._cameras[0]);
        //go to home
        var preset = this._current.goToHome();
        //Change preset.
        this.triggerEvent('change-preset', preset);

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
                            //self.triggerEvent('rotate-camera', cmd);
                            var seconds, preset = self._current.getCurrentPreset();
                            if (cmd == 'left') {
                                seconds = self._current.decrementingSeconds();
                                console.log("Segundos actuales : ", seconds);
                                if (seconds < Math.round((preset - 1) * self._intervalPreset / 1000)) {
                                    var currentPreset = parseInt(preset) - 1;
                                    self._current.setCurrentPreset(currentPreset);
                                    $("#presets").children().removeClass("active").eq(currentPreset - 1).addClass("active");
                                    self.triggerEvent('change-preset', currentPreset);
                                }
                            } else {
                                seconds = self._current.increaseSeconds();
                                console.log("Segundos actuales : ", seconds);
                                if (seconds > Math.round(preset * self._intervalPreset / 1000)) {
                                    var currentPreset = parseInt(preset) + 1;
                                    self._current.setCurrentPreset(currentPreset);
                                    $("#presets").children().removeClass("active").eq(currentPreset - 1).addClass("active");
                                    self.triggerEvent('change-preset', currentPreset);
                                }
                            }

                        }, 1000);

                        break;
                    case 'up':
                        self._current.toTop();
                        break;
                    case 'down':
                        self._current.toBottom();
                        break;
                    case 'home':
                        var preset = self._current.getHomePreset();
                        self.activePreset(preset);
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
            console.log("Init Scan ...");
            if (!this._current.isMove()) {
                var objectVLC = this._$container.children();
                this._current.showSyncScreenShot(this._$container).done(function () {
                    $overlay.addClass("active");
                    //desactivamos preset.
                    $("#presets").children().removeClass("active");
                    this._current.scanPreset();
                    //Scan Finished Handler
                    this._current.addEventListener("scan-finished", function () {
                        var preset = this._current.getHomePreset();
                        //active preset.
                        this.activePreset(preset);
                        this._current.setIsMove(true);
                        $overlay.removeClass("active");
                        setTimeout(function () {
                            console.log("Move finished chat ....");
                            this._current.setIsMove(false);
                        } .bind(this), 45 / this._current.getCountZones() * preset * 1000);
                        this._$container.empty().append(objectVLC);
                    } .bind(this), true);

                } .bind(this));
            } else {
                swal("La cámara se encuentra en movimiento");
            }
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
                console.log("Preset ...", preset);
                var $this = $(this).parent();
                if (!$this.hasClass("active")) {
                    $this.addClass("active");
                    self.activePreset(preset);
                }
            } else {
                swal("La cámara se encuentra en movimiento");
            }
        });

        //change cámara
        this._$othersCameras.on("click", "[data-camera]", function (e) {
            e.preventDefault();
            var $this = $(this);
            if (!$this.hasClass('play')) {
                $this.addClass('play').siblings().removeClass('play');
                var id = this.dataset.id;
                var camera = self._cameras.find(function (camera) {
                    return camera.getId() == id;
                });
                this._current = camera;
                //notificamos cambio de cámara.
                self.triggerEvent("change-camera", camera);
            }
        });
    };

    //Return current Camera.
    ControlPanel.prototype.getCurrentCamera = function () {
        return this._current;
    }

    //Set Current Camera
    ControlPanel.prototype.setCurrentCamera = function (camera) {
        //update snapshot image.
        if (this._current) {
            var $img = this._$othersCameras.find("[data-id=" + this._current.getId() + "] img");
            $img.attr('src', './img/loader.gif');
            this._current.takeSnapshot().done(function (response) {
                $img.attr('src', response.dataUri);
            } .bind(this));
        }
        //save new current camera.
        this._current = camera;
        //update vlc component src and aspectRatio
        if (this._vlc) {
            var url = camera.getRtspURL();
            this._vlc.setAttribute('src', url);
            this._vlc.video.aspectRatio = "4:3";
        }
        var zone = this._current.getCurrentZone();
        console.log("Esta es la zona : ", zone.idx);
        zone && $("#presets").children().removeClass("active").eq(zone.idx - 1).addClass("active");
        //update thumbnails.
        this._$othersCameras.find("[data-id=" + camera.getId() + "]").addClass("play").siblings().removeClass("play");

    }

    //Active Preset
    ControlPanel.prototype.activePreset = function (number) {
        this._current.goPreset(number);
        this._current.setIsMove(true);
        setTimeout(function () {
            console.log("Move Finished ...");
            var second = Math.round(number * this._intervalPreset / 1000 - 3);
            console.log("Segundos a establecer : ", second);
            this._current.setCurrentSecond(second);
            //save current preset
            this._current.setCurrentPreset(number);
            this._current.setIsMove(false);
        } .bind(this), Math.abs((this._current.getCurrentPreset() * this._intervalPreset) - (number * this._intervalPreset)));
        $("#presets").children().removeClass("active").eq(number - 1).addClass("active");
        //notificamos evento
        this.triggerEvent('change-preset', number);
    }

    ControlPanel.prototype._showNextImage = function () {
        $.getJSON("./stream_2.php").done(function (image) {
            this._content.attr('src', image.dataUri)
        } .bind(this)).fail(function (err) {
            console.log("Fallo al obtener la imagen");
            console.log(err);
        });
    };

    return ControlPanel;

})(EventEmitter, window, jQuery);