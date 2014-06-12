define([
        'jquery',
        'underscore',
        'slider',
        'moment',
        'threejs',
        'd3',
        'mediator',
        'trackball',
        'suncalc'
    ], function($, _, Slider, moment, three, d3, Mediator, trackball, SunCalc) {

        var SUN_DISTANCE = 400;
        var CAMERA_DISTANCE = 250;
        var ZOOM = 15;

        var greyDark = 0x434A54;
        var red = 0xDA4453;
        var redLight = 0xED5565;
        var green = 0x48CFAD;
        var greenDark = 0x37BC9B;
        var yellow = 0xF6BB42;
        var yellowDark = 0xFFCE54;
        var blue = 0x4FC1E9;
        var blueDark = 0x3BAFDA;

        function angles2cartesian(azimuth, altitude) {
            var x, y, z, radius;

            radius = SUN_DISTANCE;
            x = radius * Math.cos(altitude) * Math.sin(azimuth) * -1;
            y = radius * Math.sin(altitude);
            z = radius * Math.cos(altitude) * Math.cos(azimuth);

            return [x, y, z];
        }

        var ThreeDScene = function() {
            _.extend(this, Mediator);
            this.$el = $('.js-render-canvas');
            this.centre = [-0.0668529, 51.5127414]; // Central point as [lon, lat]

            this.mobile = ('ontouchstart' in document.documentElement);

            this.loadTextures();
            this.height = 20;
            this.extrudeSettings = {amount: this.height, bevelEnabled: false, material: 0,
                                    extrudeMaterial: 1};

            this.features = [];
            this.pause = false;

            this.subscribe('update', function() {
                var was_paused = this.pause;
                this.$el.parent().removeClass('needs-reload');
                this.pause = false;
                if(was_paused) {
                    this.animate();
                }
            });
            this.initScene();
        };

        ThreeDScene.prototype.loadTextures = function() {
            var self = this;

            this.pubMaterial = new THREE.MeshLambertMaterial({color: yellow});
            this.material = new THREE.MeshLambertMaterial({color: greyDark});
        };

        ThreeDScene.prototype.setCentre = function setCentre(coords) {
            this.centre = coords;
            this.publish('update');

            this.subscribe('map:update_centre', function() {
                this.$el.parent().addClass('needs-reload');
                this.pause = true;
            });
            return this;
        };

        // Set up the three.js scene. This is the most basic setup without
        // any special stuff
        ThreeDScene.prototype.initScene = function initScene() {
            var self = this;
            // set the scene size
            this.WIDTH = this.$el.innerWidth();
            this.HEIGHT = this.$el.innerHeight();

            // set some camera attributes
            var VIEW_ANGLE = 45,
                ASPECT = this.WIDTH / this.HEIGHT,
                NEAR = 0.1,
                FAR = 10000;

            try {
                // create a WebGL renderer, camera, and a scene
                this.renderer = new THREE.WebGLRenderer({clearColor: greyDark, antialias:true});
            } catch(e) {
                $('.js-render-canvas').parent().addClass('has-error');
                if('function' === typeof ga) {
                    ga('send', 'exception', {
                        'exDescription': 'Float Texture Unsupported',
                        'exFatal': false
                    });
                }
                return;
            }
            // Crappy hack to suprress warnings being displayed as errors in the console
            this.renderer.context.getProgramInfoLog = function () { return '' };
            this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            this.scene = new THREE.Scene();

            // add and position the camera at a fixed position
            this.scene.add(this.camera);
            this.camera.position.z = 1;
            this.camera.position.x = 0;
            this.camera.position.x = CAMERA_DISTANCE;
            this.camera.position.y = CAMERA_DISTANCE;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            //this.camera.rotation.z = Math.PI/2;
            this.camera.rotation.z = 0;

            // start the renderer, and black background
            this.renderer.setSize(this.WIDTH, this.HEIGHT);
            this.renderer.setClearColor(greyDark);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapSoft = true;

            // add the render target to the page
            this.$el.html(this.renderer.domElement);

            this.letThereBeLight()
                .createFloor()
                //.addHelpers()
                .updateSunPosition(window.currentMoment.toDate() || new Date());

            if(!this.mobile) {
                this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

                this.controls.noRotate = true;
                this.controls.noZoom = false;
                this.controls.noPan = true;
                this.controls.rotateSpeed = 0.1;

                this.controls.minDistance = 100;
                this.controls.maxDistance = CAMERA_DISTANCE + 200;
            }

            this.animate();
        };


        ThreeDScene.prototype.createFloor = function createFloor() {
            // add a base plane on which we'll render our map
            var planeGeo = new THREE.PlaneGeometry(400, 400, 10, 10);
            var planeMat = new THREE.MeshLambertMaterial({color: 0xffffff});

            this.plane = new THREE.Mesh(planeGeo, planeMat);
            this.plane.side = THREE.DoubleSide;
            this.plane.receiveShadow = true;

            // rotate it to correct position
            this.plane.rotation.x = -Math.PI/2;
            this.scene.add(this.plane);
            return this;
        };


        ThreeDScene.prototype.letThereBeLight = function letThereBeLight() {
            var self = this;
            // add a light at a specific position
            this.sun = new THREE.SpotLight(0xFFFFFF);
            this.scene.add(this.sun);
            this.sun.castShadow = true;
            this.sun.shadowDarkness = 0.4;
            this.sun.shadowCameraVisible = false;
            //this.sun.onlyShadow = true;
            this.sun.shadowMapWidth = this.WIDTH * 2;
            this.sun.shadowMapHeight = this.HEIGHT * 2;

            this.subscribe('clock:change', function(m) {
                this.updateSunPosition(m.toDate());
            });

            return this;
        };

        ThreeDScene.prototype.addHelpers = function addHelpers() {
            var self = this;
            var axes = new THREE.AxisHelper(200);
            this.scene.add(axes);
            return this;
        };

        ThreeDScene.prototype.animate = function render() {
            if(!this.pause) {
                requestAnimationFrame(_.bind(this.animate, this));
            }

            if(!this.mobile) {
                this.controls.update();
                this.camera.position.sub(this.controls.target);
            }
            this.render();
        };

        ThreeDScene.prototype.render = function render() {
            this.renderer.render(this.scene, this.camera);
            return this;
        };

        ThreeDScene.prototype.updateSunPosition = function updateSunPosition(date) {
            var dt = date || new Date();
            var centre = this.centre || [-0.0668529, 51.5127414];
            var pos = SunCalc.getPosition(dt, centre[1], centre[0]);
            var sun = angles2cartesian(pos.azimuth, pos.altitude);

            this.sun.position.x = sun[0];
            this.sun.position.y = sun[1] + 100;
            this.sun.position.z = sun[2];

            this.publish('update');

            return this;
        };

        ThreeDScene.prototype.renderBuilding = function(coords, levels, isPub, height) {
            // Make points (that are lat longs into pixel coordinates
            var points = _(coords).map(_.bind(this.convertProjection, this));
            var shape = new THREE.Shape();
            var material = this.material;

            if(isPub) {
                material = this.pubMaterial;
            }

            shape.moveTo(points[points.length-1][0], points[points.length-1][1]);

            // Add points to the shape
            _(points).each(function(xy) {
                shape.lineTo(xy[0], xy[1]);
            });

            this.extrudeSettings['amount'] = height;

            if(isPub) {
                this.extrudeSettings['amount'] += 1;
            }

            var geom = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
            var mesh = new THREE.Mesh(geom, material);

            geom.computeFaceNormals();

            mesh.rotation.x = -Math.PI/2;
            mesh.rotation.z = Math.PI/2;

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.scene.add(mesh);
            this.features.push(mesh);
            this.publish('update');
            return this;
        };

        ThreeDScene.prototype.renderRoad = function(coords) {
            var points = _(coords).map(_.bind(this.convertProjection, this));
            var material = new THREE.LineBasicMaterial({
                color: green,
                linewidth: 20,
                linecap: 'round',
                linejoin: 'round'
            });

            var geometry = new THREE.Geometry();
            _(points).each(function(point) {
                geometry.vertices.push( new THREE.Vector3( point[0], point[1], 1 ) );
            });

            var line = new THREE.Line(geometry, material);

            line.castShadow = true;
            line.receiveShadow = false;

            line.rotation.x = -Math.PI/2;
            line.rotation.z = Math.PI/2;
            this.scene.add(line);
            return this;
        };

        ThreeDScene.prototype.unload = function() {
            this.$el.html('');
        };


        ThreeDScene.prototype.convertProjection = function(coords) {
            var tileSize = 128; // Pixel size of a single map tile
            var zoom = ZOOM || 14; // Zoom level
            var projection = d3.geo.mercator()
                .center(this.centre) // Geographic coordinates of map centre
                .translate([0, 0]) // Pixel coordinates of .center()
                .scale(tileSize << zoom); // Scaling value
            var pixelValue = projection(coords); // Returns [x, y]
            return [pixelValue[1] * -1, pixelValue[0] * -1];
        };

        return ThreeDScene;
});
