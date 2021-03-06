var Map = (function (_super, w) {

    __extends(Map, _super);

    var zoom = 18;
    var default_center = { 'lat': 40.796331, 'lng': -6.242278 };
    var cow_icon = "img/cow-export.png";
    var camera_icon = "img/camera.png";

    function Map(cameras, cows) {

        this._cameras = cameras;
        this._cows = cows;
        this._currentCamera = null;
        //Intanciamos mapa
        this._map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(default_center.lat, default_center.lng),
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            draggable: true,
            scrollwheel: false,
            disableDefaultUI: true
        });
        //Instanciamos la InfoWindows.
        this._infowindow = new google.maps.InfoWindow();
        /*this._polygon = new google.maps.Polygon({
        strokeColor: '#DAA520',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#DAA520',
        fillOpacity: 0.35
        });*/
        this.angle = 0;
        this.limit_exceeded;
        this.events = {
            'change-zone': [],
            'change-camera': []
        }

    }

    Map.prototype._createMarker = function (options) {

        var marker = new google.maps.Marker({
            position: options.latlng,
            animation: google.maps.Animation.DROP,
            title: options.title,
            icon: options.type == 'camera' ? camera_icon : cow_icon
        });

        setTimeout(function () {
            marker.setMap(this._map);
        } .bind(this), (Math.random() * 30) + 1);

        return marker;
    };

    //Ajusta el mapa para dos puntos
    Map.prototype._fitMap = function (cords) {
        var bounds = new google.maps.LatLngBounds();
        //this._currentCamera.getLatlng()
        bounds.extend(cords);
        this._map.fitBounds(bounds);
    };

    //Une la infoWindows a un marker especificado.
    Map.prototype._attachInfoWindows = function (marker, body) {
        this._infowindow.close();
        this._infowindow.open(this._map, marker);
        var popup = document.getElementById("popup");
        popup.classList.remove("hide");
        popup.querySelector("[data-cow-desc]").textContent = body;
        this._infowindow.setContent(popup);
    };

    Map.prototype._createZoneFor = function (zone, idx) {
        //Polygon
        var polygon = new google.maps.Polygon({
            strokeColor: '#DAA520',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#DAA520',
            fillOpacity: 0.2
        });
        var zones = zone.map(function (poit) {
            return new google.maps.LatLng(poit.lat, poit.lng);
        });
        polygon.idx = idx + 1;
        polygon.setPath(zones);
        //Info Box
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, len = zones.length; i < len; i++) bounds.extend(zones[i]);
        polygon.label = new InfoBox({
            content: "Zone " + polygon.idx,
            boxStyle: {
                textAlign: "center",
                color: "#fff",
                fontSize: "12pt"
            },
            disableAutoPan: true,
            position: bounds.getCenter(),
            closeBoxURL: "",
            isHidden: false,
            enableEventPropagation: true
        });
        return polygon;
    }

    //Manejador evento click sobre marker tipo cámara.
    Map.prototype._onClickCamera = function (camera) {
        if (!this._currentCamera || !this._currentCamera.isMove()) {
            this.setCamera(camera);
        } else {
            swal("La cámara se encuentra en movimiento");
        }
    };

    Map.prototype._onClickCow = function (cow) {
        if (!this._currentCamera.isMove()) {
            if (!google.maps.geometry.poly.containsLocation(cow.marker.getPosition(), this._currentCamera.getArea())) {
                this._cameras.forEach(function (camera) {
                    google.maps.geometry.poly.containsLocation(cow.marker.getPosition(), camera.getArea()) && this.setCamera(camera);
                } .bind(this));
            }
            //obtenemos zonas
            var zones = this._currentCamera.getZones();
            var zone = zones.find(function (zone) {
                return google.maps.geometry.poly.containsLocation(cow.marker.getPosition(), zone);
            });
            //Notificamos cambio de zona.
            this.triggerEvent('change-zone', zone);

            //this._setCurrentTarget(cow.marker.getPosition());
            this._attachInfoWindows(cow.marker, this._cows[cow.marker.idx].content);
            //Ajustamos el mapa.
            this._fitMap(cow.marker.getPosition());
        } else {
            swal("La cámara se encuentra en movimiento");
        }

    };

    //Cambia Objetivo de la cámara
    Map.prototype._setCurrentTarget = function (target) {
        //Ajustamos viewport mapa
        this._fitMap(target);
        var camera = this._currentCamera.getLatlng();
        var radius = 0.1;
        var angle_offset = 360 / 18 - 180;
        var distancia = google.maps.geometry.spherical.computeDistanceBetween(camera, target);
        var angle = google.maps.geometry.spherical.computeHeading(camera, target);
        var v1 = new google.maps.geometry.spherical.computeOffsetOrigin(camera, distancia, angle + angle_offset);
        var v2 = new google.maps.geometry.spherical.computeOffsetOrigin(camera, distancia, angle - angle_offset);
        //Establece path del polígono para que apunte al destino
        //this._polygon.setPath([camera, v1, v2, camera]);
        this.angle = angle;
        //this._polygon.setMap(this._map);
    };

    //Establece el zoom del Mapa
    Map.prototype.setZoom = function (zoom) {
        !isNaN(parseInt(zoom)) && this._map.setZoom(parseInt(zoom));
    };

    //Devuelve el zoom Actual.
    Map.prototype.getZoom = function () {
        return this._map.getZoom();
    };

    //Cambia Cámara actual
    Map.prototype.setCamera = function (camera) {
        //cerramos info windows
        this._infowindow.close();
        //ocultamos polígono proyección
        //this._polygon.setMap(null);
        this._cameras.forEach(function (camera) {
            camera.stopAnimateMarker();
        });
        //Ocultamos la area activa.
        if (this._currentCamera) {
            this._currentCamera.getArea().setMap(null);
            var currentZone = this._currentCamera.getCurrentZone();
            if (currentZone) {
                currentZone.setMap(null);
                currentZone.label.open(null);
            }
        }

        camera.animateMarker();
        this._map.setCenter(camera.getLatlng());
        camera.getArea().setMap(this._map);

        var currentZone = camera.getCurrentZone();
        if (!currentZone) {
            var countZones = camera.getCountZones();
            var zones = camera.getZones();
            currentZone = zones[Math.round(countZones / 2 - 1)];
            camera.setCurrentZone(currentZone);
        }

        currentZone.setMap(this._map);
        currentZone.label.open(this._map);
        //guardamos referencia a la nueva cámara activa
        this._currentCamera = camera;
        //change cámera
        this.triggerEvent("change-camera", camera);
    }

    //Active Zone
    Map.prototype.activeZone = function (zone) {
        //desactivamos zona actual.
        var currentZone = this._currentCamera.getCurrentZone();
        if (currentZone) {
            currentZone.setMap(null);
            currentZone.label.open(null);
        }
        zone.setMap(this._map);
        zone.label.open(this._map);
        var bounds = new google.maps.LatLngBounds();
        var path = zone.getPath().getArray();
        for (i = 0, len = path.length; i < len; i++) bounds.extend(path[i]);
        this._fitMap(bounds.getCenter());

        this._currentCamera.setCurrentZone(zone);
    }

    Map.prototype.load = function () {
        //Cargamos las cámaras
        for (var i = 0, len = this._cameras.length; i < len; i++)
            (function (camera) {
                var marker = this._createMarker({
                    latlng: camera.getLatlng(),
                    title: camera.getTitle(),
                    type: 'camera'
                });
                marker.idx = i;
                marker.addListener('click', this._onClickCamera.bind(this, camera));
                //Comprobamos si el target inicial coincide con el marker actual.
                /*if(this.current && marker.getPosition().equals(this.current)){
                this._onChangeMarker(marker);
                }*/
                camera.setMarker(marker);

                camera.setArea(new google.maps.Polygon({
                    paths: camera.getArea(),
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.15,
                    draggable: false,
                    geodesic: true,
                    zIndex: 99
                }));

                /*google.maps.event.addListener(area, 'click', function (event) {
                console.log("Lugar pulsado : ", event.latLng.toJSON());
                });*/

                camera.setZones(camera.getZones().map(this._createZoneFor.bind(this)));

            } .bind(this))(this._cameras[i]);

        //Cargamos los objetivos
        for (var i = 0, len = this._cows.length; i < len; i++)
            (function (cow) {
                cow.latlng = new google.maps.LatLng(cow.coords.lat, cow.coords.lng);
                var marker = this._createMarker({
                    latlng: cow.latlng,
                    title: cow.title,
                    type: 'cow'
                });
                marker.idx = i;
                marker.addListener('click', this._onClickCow.bind(this, cow));
                //Comprobamos si el target inicial coincide con el marker actual.
                if (this.current && marker.getPosition().equals(this.current)) {
                    this._onClickCow(cow);
                }

                cow.marker = marker;

            } .bind(this))(this._cows[i]);

        //Establecemos la cámara por defecto
        this.setCamera(this._cameras[0]);


        //this._cameras[2].getZones().forEach(function (zone) { zone.setMap(this._map) }.bind(this));




        /*var points = this._cameras[0].getArea().getPath().getArray();
        var distance = google.maps.geometry.spherical.computeDistanceBetween(points[1], points[points.length - 2]) / 7;
        var heading = google.maps.geometry.spherical.computeHeading(points[1], points[points.length - 2]);

        var lastPoint = points[1];
        var map = this._map;
        for (var i = 0; i < 7; i++) {
        var newPoint = google.maps.geometry.spherical.computeOffset(lastPoint, distance, heading);
        var heading2 = google.maps.geometry.spherical.computeHeading(points[0], lastPoint);
        var heading3 = google.maps.geometry.spherical.computeHeading(points[0], newPoint);
        var supPoint = google.maps.geometry.spherical.computeOffset(lastPoint, distance * 10, heading2);
        var supPoint2 = google.maps.geometry.spherical.computeOffset(newPoint, distance * 10, heading3);
        new google.maps.Marker({ position: newPoint, map: map, title: 'Punto ' + i });
        var polygon = new google.maps.Polygon({
        strokeColor: '#DAA520',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#DAA520',
        fillOpacity: 0.2
        });
        polygon.setMap(map);
        polygon.setPath([points[0], lastPoint, supPoint, supPoint2, newPoint, points[points.length - 1]]);
        lastPoint = newPoint;
        }*/

    };

    //Rota el Polígono
    Map.prototype.rotatePolygon = function (direction) {

        /*if (this.limit_exceeded != direction && google.maps.geometry.poly.containsLocation(this._polygon.getCenter(), this._currentCamera.getArea())) {
        this.limit_exceeded = null;
        if (direction == "left") {
        this.angle -= 0.1;
        this._polygon.rotate(-0.1, this._currentCamera.getLatlng());
        } else {
        this.angle += 0.1;
        this._polygon.rotate(0.1, this._currentCamera.getLatlng());
        }
        } else {
        this.limit_exceeded = direction;
        }*/
    };



    return Map;

})(EventEmitter, window);
