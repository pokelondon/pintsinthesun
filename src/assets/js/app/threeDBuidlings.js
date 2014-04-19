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
            var x, y, z, radius, h;

            radius = 500;
            h = radius * Math.cos(altitude);
            y = h * Math.tan(altitude);
            x = h * Math.tan(azimuth) * -1;
            z = h * Math.cos(azimuth);

            return [x, y, z];
        }

        var ThreeDScene = function() {
            _.extend(this, Mediator);
            this.initScene();
            this.centre = [-0.0668529, 51.5127414]; // Central point as [lon, lat]
            this.subscribe('update', this.render);


            this.roofMaterials = [];
            var txRoof1 = THREE.ImageUtils.loadTexture("assets/img/textures/roof1.jpg");
            var txRoof2 = THREE.ImageUtils.loadTexture("assets/img/textures/roof2.jpg");
            var txRoof3 = THREE.ImageUtils.loadTexture("assets/img/textures/roof3.jpg");
            this.roofMaterials.push(new THREE.MeshLambertMaterial({map: txRoof1}));
            this.roofMaterials.push(new THREE.MeshLambertMaterial({map: txRoof2}));
            this.roofMaterials.push(new THREE.MeshLambertMaterial({map: txRoof3}));

            this.pubMaterialRoof = new THREE.MeshLambertMaterial({color: 0x00ffdd});
            this.materialWall = new THREE.MeshLambertMaterial({color: 0x00ff00});
            this.height = 20;
            this.extrudeSettings = { amount: this.height, bevelEnabled: false, material: 0,
                                    extrudeMaterial: 1 };

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
            var WIDTH = $('.Modal-body').innerWidth(), HEIGHT = 600;

            // set some camera attributes
            var VIEW_ANGLE = 45,
                ASPECT = WIDTH / HEIGHT,
                NEAR = 0.1,
                FAR = 10000;

            // create a WebGL renderer, camera, and a scene
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            this.scene = new THREE.Scene();

            // add and position the camera at a fixed position
            this.scene.add(this.camera);
            this.camera.position.z = 300;
            this.camera.position.x = 0;
            this.camera.position.y = 300;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.camera.rotation.x = 3*-Math.PI/2;

            // start the renderer, and black background
            this.renderer.setSize(WIDTH, HEIGHT);
            this.renderer.setClearColor(0x000);
            this.renderer.shadowMapEnabled = true;

            // add the render target to the page
            $("#ddd").append(this.renderer.domElement);

            this.letThereBeLight();
            this.createFloor();

            this.addHelpers();

            //var light = new THREE.PointLight( 0xeeff00, 1, 1000 );
            //light.position.set( 1000, 3000, -3000 );
            //this.scene.add( light );

            this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
            this.animate();
        };


        ThreeDScene.prototype.createFloor = function createFloor() {
            // add a base plane on which we'll render our map
            var planeGeo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
            var texture = THREE.ImageUtils.loadTexture("assets/img/textures/tarmac.jpg");
            var planeMat = new THREE.MeshLambertMaterial({map: texture});

            this.plane = new THREE.Mesh(planeGeo, planeMat);
            this.plane.side = THREE.DoubleSide;
            this.plane.receiveShadow = true;

            // rotate it to correct position
            this.plane.rotation.x = -Math.PI/2;
            this.scene.add(this.plane);
        };


        ThreeDScene.prototype.letThereBeLight = function letThereBeLight() {
            var self = this;
            // add a light at a specific position
            this.sun = new THREE.SpotLight(0xFFFFFF);
            this.scene.add(this.sun);

            this.sun.position.x = -100;
            this.sun.position.y = 500;
            this.sun.position.z = 1000;
            this.sun.castShadow = true;

            this.sun.shadowDarkness = 0.4;
            this.sun.shadowCameraVisible = true;

            this.updateSunPosition(new Date(2014, 4, 16, 18, 0, 0));

            this.subscribe('clock:change', function(m) {
                this.updateSunPosition(m.toDate());
            });
        };

        ThreeDScene.prototype.addHelpers = function addHelpers() {
            var self = this;
            var axes = new THREE.AxisHelper(200);
            this.scene.add(axes);

            (function() {
                var southBox = new THREE.CubeGeometry(10, 10, 10);
                var cubeMat = new THREE.MeshPhongMaterial({color: 0xff0000});
                var cubeMesh = new THREE.Mesh(southBox, cubeMat);
                self.scene.add(cubeMesh);
                cubeMesh.position.x = 200;
                cubeMesh.position.y = 0;
                cubeMesh.position.z = 0;
            }());

            (function() {
                var southBox = new THREE.CubeGeometry(10, 10, 10);
                var cubeMat = new THREE.MeshPhongMaterial({color: 0x00ff00});
                var cubeMesh = new THREE.Mesh(southBox, cubeMat);
                self.scene.add(cubeMesh);
                cubeMesh.position.x = 0;
                cubeMesh.position.y = 200;
                cubeMesh.position.z = 0;
            }());

            (function() {
                var southBox = new THREE.CubeGeometry(10, 10, 10);
                var cubeMat = new THREE.MeshPhongMaterial({color: 0x0000ff});
                var cubeMesh = new THREE.Mesh(southBox, cubeMat);
                self.scene.add(cubeMesh);
                cubeMesh.position.x = 0;
                cubeMesh.position.y = 0;
                cubeMesh.position.z = 200;
            }());

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

        ThreeDScene.prototype.updateSunPosition = function updateSunPosition(date) {
            var dt = date || new Date(2014, 04, 16, 10, 0, 0);
            var centre = this.centre || [-0.0668529, 51.5127414];
            var pos = SunCalc.getPosition(dt, centre[1], centre[0]);
            //var azimuth = pos.azimuth * 180 / Math.PI;
            //var altitude = pos.altitude * 180 / Math.PI;

            var sun = angles2cartesian(pos.azimuth, pos.altitude);

            this.sun.position.x = sun[0];
            this.sun.position.y = sun[1];
            this.sun.position.z = sun[2];

            this.publish('update');
        };

        ThreeDScene.prototype.renderBuilding = function(coords, levels, isPub) {
            // Make points (that are lat longs into pixel coordinates
            var points = _(coords).map(_.bind(this.convertProjection, this));
            var shape = new THREE.Shape();
            var materialRoof = this.roofMaterials[_.random(0, this.roofMaterials.length -1)];
            if(isPub) {
                materialRoof = this.pubMaterialRoof;
            }

            shape.moveTo(points[points.length-1][0], points[points.length-1][1]);

            // Add points to the shape
            _(points).each(function(xy) {
                shape.lineTo(xy[0], xy[1]);
            });

            this.extrudeSettings['amount'] = levels * 8;

            var materials = [materialRoof, this.materialWall];
            var geom = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
            var meshMaterial = new THREE.MeshFaceMaterial(materials);
            var mesh = new THREE.Mesh(geom, meshMaterial);

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
            var pixelValue = projection(coords); // Returns [x, y]
            return [pixelValue[1] * -1, pixelValue[0] * -1];
        };

        return ThreeDScene;
});
