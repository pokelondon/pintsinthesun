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
        };
        // Set up the three.js scene. This is the most basic setup without
        // any special stuff
        ThreeDScene.prototype.initScene = function initScene() {
            var self = this;
            // set the scene size
            var WIDTH = 400, HEIGHT = 400;

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
            this.camera.position.z = 150;
            this.camera.position.x = 0;
            this.camera.position.y = 30;
            this.camera.lookAt( this.scene.position );

            // start the renderer, and black background
            renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor(0x000);
            renderer.shadowMapEnabled = true;

            // add the render target to the page
            $("#ddd").append(renderer.domElement);

            // add a light at a specific position
            var pointLight = new THREE.SpotLight(0xFFFFFF);
            this.scene.add(pointLight);
            pointLight.position.x = 300;
            pointLight.position.y = 220;
            pointLight.position.z = -220;
            pointLight.castShadow = true;

            pointLight.shadowDarkness = 1;
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

        ThreeDScene.prototype.renderBuilding = function() {
            var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var cylinder = new THREE.Mesh( geometry, material );
            cylinder.castShadow = true;
            cylinder.receiveShadow = false;
            cylinder.position.y = 20;
            this.scene.add( cylinder );
        };

        ThreeDScene.prototype.render = function() {
        };

        return ThreeDScene;
});
