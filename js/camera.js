var Camera = (function (_super, w, $) {

    __extends(Camera, _super);

    var totalTime = 45;

    //Camera Constructor
    function Camera(options) {
        this._id = options.id;
        this._title = options.title;
        this._ip = options.ip;
        this._latlngPlain = options.coords;
        this._latlng = new google.maps.LatLng(options.coords.lat, options.coords.lng);
        this._area = options.area;
        this._zones = options.zones;
        this._currentZone = null;
        this._marker = null;
        this._currentPreset = 4;
        this._isMove = false;
        this._currentSecond = 0;
        this.events = {
            'scan-finished': [],
            'change-preset': []
        }
    }

    Camera.prototype.getId = function () {
        return this._id;
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

    Camera.prototype.getZoneByIdx = function (idx) {
        return this._zones.find(function (zone) {
            return zone.idx == parseInt(idx);
        });
    }

    Camera.prototype.getCountZones = function () {
        return this._zones.length;
    }

    Camera.prototype.setZones = function (zones) {
        this._zones = zones;
    }

    Camera.prototype.setIsMove = function (val) {
        this._isMove = val;
    }

    Camera.prototype.isMove = function () {
        return this._isMove;
    }

    Camera.prototype.getCurrentZone = function () {
        return this._currentZone;
    }

    Camera.prototype.setCurrentZone = function (zone) {
        this._currentZone = zone;
    }

    Camera.prototype.getCurrentPreset = function () {
        return this._currentPreset;
    }

    Camera.prototype.setCurrentPreset = function (preset) {
        this._currentPreset = preset;
    }

    Camera.prototype.getHomePreset = function () {
        return Math.round(this._zones.length / 2);
    }

    Camera.prototype.setCurrentSecond = function (second) {
        this._currentSecond = second;
    }

    Camera.prototype.getCurrentSecond = function () {
        return this._currentSecond;
    }

    Camera.prototype.increaseSeconds = function () {
        return ++this._currentSecond;
    }

    Camera.prototype.decrementingSeconds = function () {
        return --this._currentSecond;
    }

    //Send Command to Proxy
    Camera.prototype._cmdSubmit = function (params) {
        $.get("./ptzCtrlProxy.php", { 'ip': this._ip, 'params': params }).fail(function () { 
            swal("La acción no se ha podido realizar");
        })
    };


    Camera.prototype._setPresets = function (number) {
        console.log("Estableciendo Preset : ", number);
        ///hy-cgi/ptz.cgi?cmd=preset&act=set&status=1&number="+num+"'");
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'set', 'status': 1, 'number': number });
    }


    Camera.prototype.scanPreset = function () {
        console.log("Move to left");
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'left' });
        setTimeout(function () {
            console.log("Init Scan");
            //Init Set Presets
            var setPresetsTimer = null;
            var interval = Math.floor(totalTime / this._zones.length * 1000);
            var delay = interval / 2;
            console.log("Interval : " + interval);
            console.log("Delay : " + delay);
            setTimeout(function () {
                var number = 1;
                this._setPresets(number);
                setPresetsTimer = setInterval(function () {
                    this._setPresets(++number);
                } .bind(this), interval);
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

        } .bind(this), 45000);
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

    Camera.prototype.verticalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'vscan' });
    };

    Camera.prototype.horizontalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'hscan' });
    };

    Camera.prototype.stopScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'stop' });
    };

    //Go to preset
    Camera.prototype.goPreset = function (number) {
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'goto', 'status': 1, 'number': number });
    }

    Camera.prototype.goToHome = function () {
        var preset = Math.round(this._zones.length / 2);
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'goto', 'status': 1, 'number': preset });
        return preset;
    }

    Camera.prototype.getRtspURL = function () {
        return 'rtsp://admin:123456@' + this._ip + ':554/live/ch0';
    }

    //640 x 480
    /*Camera.prototype.showIn = function ($target, size, vlc, options) {
    if (!vlc) {
    this._content = $("<img>", { 'width': size.width, 'height': size.height });
    } else {
    var $embed = $("<embed>", {
    'id': 'vlc' + this._id,
    'name': 'vlc_camera',
    'type': 'application/x-vlc-plugin',
    'pluginspage': 'http://www.videolan.org',
    'width': size.width,
    'height': size.height,
    'target': 
    });

    this._content = $("<object>").append(
    $("<param>", { 'name': 'autostart', 'value': 'true' }),
    $("<param>", { 'name': 'movie', 'value': 'rtsp://admin:123456@' + this._ip + ':554/live/ch0' }),
    options.map(function (option) {
    return $("<param>", { 'name': option.name, 'value': option.value });
    })).append($embed);
    }

    this._content.appendTo($target);
    };*/

    Camera.prototype.showSyncScreenShot = function ($target) {
        return $.getJSON('./screenshot.php', { 'ip': this._ip }).pipe(function (response) {
            $("<figure>", { 'data-id': this._id, 'data-camera': true, 'class': 'camera-screenshot sync' })
                    .append(
                        $("<img>", { 'src': response.dataUri, 'width': 640, 'height': 480, 'title': this._title }),
                        $("<figcaption>", { 'text': this._title })
                    ).appendTo($target.empty());
        });
    }

    Camera.prototype.takeSnapshot = function () {
        return $.getJSON('./screenshot.php', { 'ip': this._ip });
    }

    Camera.prototype.animateMarker = function () {
        this._marker && this._marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    Camera.prototype.stopAnimateMarker = function () {
        this._marker && this._marker.setAnimation(null);
    };


    return Camera;


})(EventEmitter, window, jQuery);
