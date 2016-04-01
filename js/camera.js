var Camera = (function (_super, w, $) {

    __extends(Camera, _super);

    var totalTime = 45;

    //Camera Constructor
    function Camera(options) {
        this._id = options.id;
        this._title = options.title;
        this._url = options.url;
        this._latlngPlain = options.coords;
        this._latlng = new google.maps.LatLng(options.coords.lat, options.coords.lng);
        this._area = options.area;
        this._zones = options.zones;
        this._timer = null;
        this._content = null;
        this._marker = null;
        this.presets = [];
        this._isMove = false;
        this.events = {
            'scan-finished': []
        }
    }


    //Getters and Setters
    Camera.prototype.getTitle = function () {
        return this._title;
    };

    Camera.prototype.getLatlng = function () {
        return this._latlng;
    };

    Camera.prototype.getLatlngPlain = function () {
        return this._latlngPlain;
    };

    Camera.prototype.setMarker = function (marker) {
        this._marker = marker;
    };

    Camera.prototype.getMarker = function () {
        return this._marker;
    };

    Camera.prototype.getArea = function () {
        return this._area;
    };

    Camera.prototype.setArea = function (area) {
        this._area = area;
    }

    Camera.prototype.getZones = function () {
        return this._zones;
    }

    Camera.prototype.getCountZones = function () {
        return this._zones.length;
    }

    Camera.prototype.setZones = function (zones) {
        this._zones = zones;
    }

    Camera.prototype.getPresets = function () {
        return this.presets;
    }

    Camera.prototype.setIsMove = function (val) {
        this._isMove = val;
    }

    Camera.prototype.isMove = function () {
        return this._isMove;
    }

    //Send Command to Proxy
    Camera.prototype._cmdSubmit = function (params) {
        $.get("./ptzCtrlProxy.php", params);
    };

    Camera.prototype._showNextImage = function () {
        $.getJSON("./stream_2.php").done(function (image) {
            this._content.attr('src', image.dataUri)
        } .bind(this)).fail(function (err) {
            console.log("Fallo al obtener la imagen");
            console.log(err);
        });
    };

    Camera.prototype._setPresets = function () {
        var count = this.presets.length + 1;
        console.log("Estableciendo Presets número " + count);
        this.presets.push({ 'name': 'Preset Número ' + count, 'id': count });
        ///hy-cgi/ptz.cgi?cmd=preset&act=set&status=1&number="+num+"'");
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'set', 'status': 1, 'number': count });
    }


    Camera.prototype.scanPreset = function () {
        this.presets = [];
        console.log("Move to left");
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'left' });
        setTimeout(function () {
            console.log("Init Scan");
            //Init Set Presets
            console.log("Estas son las zones");
            console.log(this._zones.length);

            var setPresetsTimer = null;
            var interval = Math.floor(totalTime / this._zones.length * 1000);
            var delay = interval / 2;
            console.log("Interval : " + interval);
            console.log("Delay : " + delay);
            setTimeout(function () {
                this._setPresets();
                setPresetsTimer = setInterval(this._setPresets.bind(this), interval);
            } .bind(this), delay);

            var moveTimer = setInterval(function () {
                console.log("move...")
                this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'right' });
            } .bind(this), 1000);

            setTimeout(function () {
                console.log("Scan Finished");
                clearInterval(setPresetsTimer);
                clearInterval(moveTimer);
                this.triggerEvent('scan-finished');

            } .bind(this), 45000);

        } .bind(this), 24000);
    }


    //PTZ Controls
    Camera.prototype.toLeft = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'left' });
    };

    Camera.prototype.toRight = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'right' });
    };

    Camera.prototype.toTop = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'up' });
    };

    Camera.prototype.toBottom = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'down' });
    };

    Camera.prototype.toHome = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'home' });
    };

    Camera.prototype.stop = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'stop' });
    };

    Camera.prototype.hide = function () {
        this._content.find("object").replaceWith($("<img>",{'src': './img/vaca.jpg'}));
    }

    Camera.prototype.verticalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'vscan' });
    };

    Camera.prototype.horizontalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'hscan' });
    };

    Camera.prototype.stopScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'stop' });
    };

    //
    Camera.prototype.goPreset = function (number) {
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'goto', 'status': 1, 'number': number });
    }

    //640 x 480
    Camera.prototype.showIn = function ($target, size, vlc, options) {
        if (!vlc) {
            this._content = $("<img>", { 'width': size.width, 'height': size.height });
        } else {
            this._content = $("<div>", { 'id': this._id, 'data-camera': true })
                    .css({ 'width': size.width, 'height': size.height }).append(
                    $("<object>").append(
                        $("<param>", { 'name': 'autostart', 'value': 'true' }),
                        $("<param>", { 'name': 'movie', 'value': this._url }),
                        $("<param>", { 'name': 'wmode', 'value': 'transparent' }),
                        options.map(function (option) {
                            return $("<param>", { 'name': option.name, 'value': option.value });
                        }),
				        $("<embed>", {
				            'id': 'vlc' + this._id,
				            'name': 'vlc_camera',
				            'type': 'application/x-vlc-plugin',
				            'pluginspage': 'http://www.videolan.org',
				            'width': size.width,
				            'height': size.height,
				            'target': this._url
				        })
			    )
            );
        }
        this._content.appendTo($target);
    };


    Camera.prototype.animateMarker = function () {
        this._marker && this._marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    Camera.prototype.stopAnimateMarker = function () {
        this._marker && this._marker.setAnimation(null);
    };

    Camera.prototype.play = function () {
        if (this._content.get(0) instanceof HTMLImageElement) {
            //configuramos el timer.
            this._timer = setInterval(this._showNextImage.bind(this), 330);
        }
    };

    return Camera;


})(EventEmitter, window, jQuery);
