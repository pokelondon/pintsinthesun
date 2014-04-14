define([
        'jquery',
        'underscore',
        'slider',
        'moment',
        'threejs',
        'd3',
        'mediator'
    ], function($, _, Slider, moment, three, d3, Mediator) {

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
            var WIDTH = 640, HEIGHT = 640;

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
            var pointLight = new THREE.SpotLight(0xFFFFFF);
            this.scene.add(pointLight);
            pointLight.position.x = 400;
            pointLight.position.y = 320;
            pointLight.position.z = -220;
            pointLight.castShadow = true;

            pointLight.shadowDarkness = 0.4;
            pointLight.shadowCameraVisible = true;

            // add a base plane on which we'll render our map
            var planeGeo = new THREE.PlaneGeometry(1000, 1000, 10, 10);
            var planeMat = new THREE.MeshLambertMaterial({color: 0x666699});
            this.plane = new THREE.Mesh(planeGeo, planeMat);
            this.plane.receiveShadow = true;

            // rotate it to correct position
            this.plane.rotation.x = -Math.PI/2;
            this.scene.add(this.plane);
            this.render();
        };

        ThreeDScene.prototype.render = function render() {
            //requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
            return this;
        };

        ThreeDScene.prototype.renderBuilding = function(coords) {
            // Make points (that are lat longs into pixel coordinates
            var points = _(coords).map(_.bind(this.convertProjection, this));
            var shape = new THREE.Shape();


            shape.moveTo(points[points.length-1][0], points[points.length-1][1]);

            // Add points to the shape
            _(points).each(function(xy) {
                shape.lineTo(xy[0], xy[1]);
            });

            var geom = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
            var mesh = new THREE.Mesh(geom, this.material);
            geom.computeFaceNormals();

            mesh.rotation.x = -Math.PI/2;

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
            // Pixel location of Heathrow Airport to relation to central point (geoCoords)
            var pixelValue = projection(coords); // Returns [x, y]
            return pixelValue;
        };

        return ThreeDScene;
});
