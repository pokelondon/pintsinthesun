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

        function angles2cartesian(azimuth, altitude) {
            var x, y, z, h;

            y = 300;
            x = Math.tan(90 + azimuth) * y;
            h = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            z = Math.tan(altitude) * h;

            return [x, y, z];
        }

        var ThreeDScene = function() {
            _.extend(this, Mediator)
            this.initScene();
            this.centre = [-0.0668529, 51.5127414]; // Central point as [lon, lat]
            this.subscribe('update', this.render);

            this.material = new THREE.MeshLambertMaterial({color: 0xffeedd});
            this.height = 20;
            this.extrudeSettings = { amount: this.height, bevelEnabled: false };

            this.features = [];
        };

        ThreeDScene.prototype.setCentre = function setCentre(coords) {
            this.centre = coords;
            this.publish('update');
            return this;
        };

        // Set up the three.js scene. This is the most basic setup without
        // any special stuff
        ThreeDScene.prototype.initScene = function initScene() {
            var self = this;
            // set the scene size
            var WIDTH = 600, HEIGHT = 600;

            // set some camera attributes
            var VIEW_ANGLE = 45,
                ASPECT = WIDTH / HEIGHT,
                NEAR = 0.1,
                FAR = 1000;

            // create a WebGL renderer, camera, and a scene
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            this.scene = new THREE.Scene();

            // add and position the camera at a fixed position
            this.scene.add(this.camera);
            this.camera.position.z = 100;
            this.camera.position.x = -100;
            this.camera.position.y = 350;
            this.camera.lookAt(new THREE.Vector3(0, 50, 0));

            // start the renderer, and black background
            this.renderer.setSize(WIDTH, HEIGHT);
            this.renderer.setClearColor(0x000);
            this.renderer.shadowMapEnabled = true;

            // add the render target to the page
            $("#ddd").append(this.renderer.domElement);

            // add a light at a specific position
            this.pointLight = new THREE.SpotLight(0xFFFFFF);
            this.scene.add(this.pointLight);

            this.pointLight.position.x = 1072;
            this.pointLight.position.y = 300;
            this.pointLight.position.z = 1132;
            this.pointLight.castShadow = true;

            this.pointLight.shadowDarkness = 0.4;
            this.pointLight.shadowCameraVisible = true;

            // add a base plane on which we'll render our map
            var planeGeo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
            var planeMat = new THREE.MeshLambertMaterial({color: 0x666699});
            this.plane = new THREE.Mesh(planeGeo, planeMat);
            this.plane.receiveShadow = true;

            // rotate it to correct position
            this.plane.rotation.x = -Math.PI/2;
            this.scene.add(this.plane);

            this.updateSunPosition(new Date());

            this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
            this.animate();
        };

        ThreeDScene.prototype.addHelpers = function addHelpers() {
            var axes = new THREE.AxisHelper(200);
            this.scene.add(axes);
        };


        ThreeDScene.prototype.animate = function render() {
            requestAnimationFrame(_.bind(this.animate, this));

            this.controls.update();
            this.camera.position.sub(this.controls.target);
            this.render();
        };

        ThreeDScene.prototype.render = function render() {
            //requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
            return this;
        };

        ThreeDScene.prototype.updateSunPosition = function updateSunPosition(date, centre) {
            var dt = date || new Date();
            var pos = SunCalc.getPosition(dt, this.centre[1], this.centre[0]);
            var azimuth = pos.azimuth * 180 / Math.PI;
            var altitude = pos.altitude * 180 / Math.PI;
            console.log(azimuth, altitude, this.centre);

            var sun = angles2cartesian(azimuth, altitude);

            this.pointLight.position.x = sun[0];
            this.pointLight.position.y = sun[1];
            this.pointLight.position.z = sun[2];
            this.pointLight.lookAt(new THREE.Vector3(0, 50, 0));

            console.log('Updating sun position for', dt);

            this.publish('update');
        };

        ThreeDScene.prototype.renderBuilding = function(coords, levels) {
            // Make points (that are lat longs into pixel coordinates
            var points = _(coords).map(_.bind(this.convertProjection, this));
            var shape = new THREE.Shape();


            shape.moveTo(points[points.length-1][0], points[points.length-1][1]);

            // Add points to the shape
            _(points).each(function(xy) {
                shape.lineTo(xy[0], xy[1]);
            });

            this.extrudeSettings['amount'] = levels * 8;
            var geom = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
            var mesh = new THREE.Mesh(geom, this.material);
            geom.computeFaceNormals();

            mesh.rotation.x = 3 * Math.PI/2;

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.scene.add(mesh);
            this.features.push(mesh);
            this.publish('update');
            return this;
        };

        ThreeDScene.prototype.unload = function() {
            this.scene;
        };


        ThreeDScene.prototype.convertProjection = function(coords) {
            var tileSize = 256; // Pixel size of a single map tile
            var zoom = 15; // Zoom level
            var projection = d3.geo.mercator()
                .center(this.centre) // Geographic coordinates of map centre
                .translate([0, 0]) // Pixel coordinates of .center()
                .scale(tileSize << zoom); // Scaling value
            var pixelValue = projection(coords).reverse(); // Returns [x, y]
            return pixelValue;
        };

        return ThreeDScene;
});
