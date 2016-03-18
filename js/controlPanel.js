var ControlPanel = (function (_super, w, $) {

    __extends(ControlPanel, _super);

    function ControlPanel(cameras) {
        this._cameras = cameras;
        this._current = 0;
        this._$container = $("#container");
        this.events = {
            'rotate-camera': [],
            'camera-zoom': [],
            'change-camera': []
        }
    }

    ControlPanel.prototype.init = function () {

        //Activamos por defecto la primera cámara
        this._current = this._cameras[this._current];
        this._current.showIn(this._$container);
        //Funcionalidad para los controles.
        var self = this;
        var timer = null;
        //Main PTZ Actions.
        $("#mainControls").on("mousedown", "[data-control]", function (e) {
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

        }).on("mouseup click", "[data-control]", function (e) {
            self._current.stop();
            clearInterval(timer);
        });

        //Other PTZ Actions.
        $("#otherControls").on("click", "[data-control]", function (e) {
            e.preventDefault();
            var cmd = this.dataset.control.toLowerCase();
            switch (cmd) {
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

        $("#showPresets").on("click", function (e) {
            e.preventDefault();
            $(this).toggleClass("active").next().toggleClass("collapsible");

        });

        $("#zoom").on("change", function (e) {
            self.triggerEvent('camera-zoom', parseInt(this.value));
        });


        this._current.addEventListener("scan-finished", function () {
            console.log("Scan Finalizado ...");
            var presets = this.getPresets();
            var $fragment = $(document.createDocumentFragment());
            for (var i = 0; i < presets.length; i++) {
                $fragment.append(
                    $("<li>", { 'class': 'preset' }).append(
                        $("<a>", { 'text': presets[i].id, 'href': '#', 'data-preset': presets[i].id })
                    )
                 );
            }
            $("#presets").append($fragment);
        });

        var self = this;
        $("#presets").on("click", "[data-preset]", function (e) {
            e.preventDefault();
            var preset = this.dataset.preset;
            var $this = $(this);
            if (!$this.hasClass("active")) {
                $this.addClass("active").parent().siblings().children().removeClass("active");
                self._current.goPreset(preset);
            }

        });

    };


    return ControlPanel;

})(EventEmitter, window, jQuery);