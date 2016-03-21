var Camera = (function (_super, w, $) {

    __extends(Camera, _super);

    //Camera Constructor
    function Camera(options) {
        this._title = options.title;
        this._url = options.url;
        this._latlngPlain = options.coords;
        this._latlng = new google.maps.LatLng(options.coords.lat, options.coords.lng);
        this._area = new google.maps.Polygon({
            paths: options.area,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.15,
            draggable: false,
            geodesic: true
        });
        this._zones = this._createZones(options.zones);
        this._timer = null;
        this._content = null;
        this._areaPolygon = null;
        this._marker = null;
        this.presets = [];
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

    Camera.prototype.getZones = function () {
        return this._zones;
    }

    Camera.prototype.getPresets = function () {
        return this.presets;
    }

    Camera.prototype._createZones = function(zones){
        return zones.map(function (zone, idx) {
            var bounds = new google.maps.LatLngBounds();
            var polygon = new google.maps.Polygon({
                strokeColor: '#DAA520',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#DAA520',
                fillOpacity: 0.2
            });
            polygon.idx = ++idx;
            var zones = zone.map(function (poit) {
                return new google.maps.LatLng(poit.lat, poit.lng);
            });
            polygon.setPath(zones);
            for (var i = 0, len = zones.length; i < len; i++) bounds.extend(zones[i]);
            var center = bounds.getCenter();
            polygon.label = new InfoBox({
                content: "Zone " + polygon.idx,
                boxStyle: {
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "22pt"
                },
                disableAutoPan: true,
                pixelOffset: new google.maps.Size(-25, 0),
                position: center,
                closeBoxURL: "",
                isHidden: false,
                enableEventPropagation: true
            });

            return polygon;
        });
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

    Camera.prototype._scan = function (direction, seconds, cb) {

        //Left Scan
        var scanTimer = setInterval(function () {
            seconds--;
            this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': direction });
            console.log("Segundos Restantes");
            console.log(seconds);
            if (seconds == 0) { clearTimeout(scanTimer); cb(); }
        } .bind(this), 1000);
    }


    Camera.prototype._setPresets = function () {
        var count = this.presets.length + 1;
        console.log("Estableciendo Presets número " + count);
        this.presets.push({ 'name': 'Preset Número ' + count, 'id': count });
        ///hy-cgi/ptz.cgi?cmd=preset&act=set&status=1&number="+num+"'");
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'set', 'status': 1, 'number': count });
    }


    Camera.prototype._scanPreset = function () {
        console.log("Move to left");
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'left' });
        setTimeout(function () {
            console.log("Init Scan");
            this._setPresets();
            //Init Set Presets
            var setPresetsTimer = setInterval(this._setPresets.bind(this), 8000);
            var moveTimer = setInterval(function () {
                console.log("move...")
                this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'right' });
            } .bind(this), 1000);


            setTimeout(function () {
                console.log("Scan Finished");
                clearInterval(setPresetsTimer);
                clearInterval(moveTimer);
                //Final Preset
                this._setPresets();
                //go to home
                this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'home' });
                setTimeout(function () {
                    this.triggerEvent('scan-finished');
                } .bind(this), 24000);

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

    Camera.prototype.verticalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'vscan' });
    };

    Camera.prototype.horizontalScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'hscan' });
    };

    Camera.prototype.stopScan = function () {
        this._cmdSubmit({ 'cmd': 'ptzctrl', 'act': 'stop' });
    };

    Camera.prototype.goPreset = function (number) {
        this._cmdSubmit({ 'cmd': 'preset', 'act': 'goto', 'status': 1, 'number': number });
    }

    Camera.prototype.showIn = function ($target) {
        if (!this._content) {
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                this._content = $("<img>", { 'width': 640, 'height': 480 });
            } else {
                if (w.confirm("¿Usar Componente VLC para visualizar Vídeo?")) {
                    this._content = $("<object>", { 'id': 'player' }).append(
						$("<param>", { 'name': 'movie', 'value': this._url }),
						$("<param>", { 'name': 'autostart', 'value': true }),
						$("<embed>", {
						    'id': 'vlc',
						    'type': 'application/x-vlc-plugin',
						    'pluginspage': 'http://www.videolan.org',
						    'name': 'video1',
						    'autoplay': 'no',
						    'loop': 'no',
						    'width': 640,
						    'height': 480,
						    'target': this._url
						})
					)
                } else {
                    this._content = $("<img>", { 'width': 640, 'height': 480 });
                }
            }
        }
        this._content.appendTo($target);
    };

    Camera.prototype.showAreaIn = function (map) {
        this._area.setMap(map);
    };

    Camera.prototype.hideArea = function () {
        this._area && this._area.setMap(null);
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
