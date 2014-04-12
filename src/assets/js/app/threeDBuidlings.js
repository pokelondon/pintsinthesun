define([
        'jquery',
        'underscore',
        'slider',
        'moment',
        'threejs',
        'd3'
    ], function($, _, Slider, moment, three, d3) {

        var ThreeDScene = function() {
            this.initScene();
            this.centre = [-0.0668529, 51.5127414]; // Central point as [lon, lat]
        };

        ThreeDScene.prototype.setCentre = function setCentre(coords) {
            this.centre = coords;
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
            var renderer = new THREE.WebGLRenderer({antialias:true});
            this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
            this.scene = new THREE.Scene();

            // add and position the camera at a fixed position
            this.scene.add(this.camera);
            this.camera.position.z = 100;
            this.camera.position.x = 0;
            this.camera.position.y = 350;
            this.camera.lookAt(new THREE.Vector3(0, 50, 0));

            // start the renderer, and black background
            renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor(0x000);
            renderer.shadowMapEnabled = true;

            // add the render target to the page
            $("#ddd").append(renderer.domElement);

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

            function render() {
                requestAnimationFrame(render);
                renderer.render(self.scene, self.camera);
            }
            render();
        };

        ThreeDScene.prototype.renderBuilding = function(coords) {
            var self = this;
            var material = new THREE.MeshLambertMaterial({color: 0xffeedd});
            var height = 20;
            var extrudeSettings = { amount: height, bevelEnabled: false };
            var shape = new THREE.Shape();

            shape.moveTo(0, 0);

            _(coords).each(function(xy) {
                var pixelCoords = self.convertProjection(xy);
                shape.lineTo(pixelCoords[0], pixelCoords[1]);
            });

            // Close the shape
            //shape.lineTo(coords[0][0], coords[0][1]);

            var geom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            var mesh = new THREE.Mesh(geom, material);

            mesh.rotation.x = -Math.PI/2;
            mesh.rotation.z = -Math.PI/2;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            this.convertProjection(51.5126588, -0.0668385);
        };

        ThreeDScene.prototype.render = function() {
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
