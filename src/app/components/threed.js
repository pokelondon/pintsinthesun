import React from 'react';
import THREE from 'three';
import SunCalc from '../lib/suncalc';
import d3 from 'd3';
import TWEEN from 'tween.js';

import { fetchBuildings } from '../services/overpass';


const GREYDARK = 0x232A24;
const RED = 0xf05440;
const GREEN = 0x48CFAD;
const YELLOW = 0xf7efdb;
const BLUE = 0x4FC1E9;
const WHITE = 0xFFFFFF;

const PUB_MATERIAL = new THREE.MeshLambertMaterial({color: YELLOW});
const BUILDING_MATERIAL = new THREE.MeshLambertMaterial({
    color: GREYDARK,
});
const TARGET_MATERIAL = new THREE.MeshPhongMaterial({
    color: RED,
    shininess: 5,
    specular: WHITE,
    shading: THREE.SmoothShading
});

const FLOOR_MATERIAL = new THREE.MeshLambertMaterial({
    color: YELLOW,
});

const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;
const SUN_DISTANCE = 400;
const CAMERA_DISTANCE = 250;
//const ZOOM = 15.5;
const ZOOM = 16;
const EXTRUDE_SETTINGS = {bevelEnabled: false, material: 0, extrudeMaterial: 1};


function angles2cartesian(azimuth, altitude) {
    var radius = SUN_DISTANCE;
    var x = radius * Math.cos(altitude) * Math.sin(azimuth);
    var y = radius * Math.sin(altitude);
    var z = (radius * Math.cos(altitude) * Math.cos(azimuth)) + 70;

    z = Math.max(10, z);

    return [x, y, z];
}


class ThreeD extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isTransitioning: false
        }
        this.building_refs = [];
    }

    componentDidMount() {
        this.WIDTH = 600;
        this.HEIGHT = 600;

            // set some camera attributes
        const ASPECT = this.WIDTH / this.HEIGHT;

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({clearColor: '#ccc', antialias: true});
        this.scene.add(this.camera);

        this.camera.position.z = CAMERA_DISTANCE;
        this.camera.position.x = 1;
        this.camera.position.y = 100;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.rotation.z = Math.PI;

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.soft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.refs.canvas.appendChild(this.renderer.domElement);

        this.createFloor()
            .createLights()
            .updateSunPosition()
            .updateBuildings()
            .addTarget()
            .animate();

    }

    componentDidUpdate(prevProps) {
        if(this.props.centre.lat !== prevProps.centre.lat) {
            this.updateBuildings();
        }
        this.updateSunPosition();
    }

    componentWillUnmount() {
        this.renderer.dispose();
        this.refs.canvas.remove();
        if(this.cancelablePromise && this.cancelablePromise.cancel) {
            this.cancelablePromise.cancel();
        }
    }

    render() {
        return (
            <div
                className={(this.state.isTransitioning) ? 'Render is-transitioning' : 'Render'}
                ref='canvas'
            />
        )
    }

    renderBuildings(buildings) {
        this.clearBuildings();
        buildings.forEach(building => this.renderBuilding(building));
    }

    updateBuildings() {
        let { lat, lng } = this.props.centre;
        this.cancelablePromise = fetchBuildings(lat, lng);
        this.cancelablePromise.promise.then(buildings => this.renderBuildings(buildings));
        return this;
    }

    clearBuildings() {
        this.building_refs.forEach(ref => {
            this.scene.remove(this.scene.getObjectByName(ref));
        });
        this.building_refs = [];
    }

    addTarget() {
        let { lat, lng } = this.props.centre;
        let [x, y] = this.convertProjection([lat, lng]);
        var geometry = new THREE.CircleGeometry(10, 20);
        this.target = new THREE.Mesh(geometry, TARGET_MATERIAL);

        this.target.rotation.z = -Math.PI/2;
        this.target.position.y = 10;
        this.target.receiveShadow = true;
        this.scene.add(this.target);
        return this;
    }

    createFloor() {
        const planeGeo = new THREE.PlaneGeometry(400, 400, 10, 10);
        this.plane = new THREE.Mesh(planeGeo, FLOOR_MATERIAL);
        this.plane.receiveShadow = true;
        this.plane.position.z = -1;
        this.scene.add(this.plane);
        return this;
    }

    createLights() {
        var ambient = new THREE.AmbientLight(0xa0a0a0);
        this.scene.add(ambient);
        // add a light at a specific position
        this.sun = new THREE.SpotLight(WHITE);
        this.scene.add(this.sun);
        this.sun.penumbra = 0;
        this.sun.distance = 1000;
        this.sun.intensity = 2;

        this.sun.shadow.camera.near = 300;
        this.sun.shadow.camera.far = 600;
        this.sun.shadow.camera.fov = 40;

        this.sun.castShadow = true;

        this.sun.shadow.mapSize.width = this.WIDTH * 2;
        this.sun.shadow.mapSize.height = this.HEIGHT * 2;

        if(window.HELPERS) {
            var shadowCameraHelper = new THREE.CameraHelper( this.sun.shadow.camera );
            shadowCameraHelper.visible = true;
            this.scene.add(shadowCameraHelper);
        }

        return this;
    }

    updateSunPosition() {
        let { lat, lng } = this.props.centre;
        var pos = SunCalc.getPosition(this.props.date, lat, lng);
        var sun = angles2cartesian(pos.azimuth, pos.altitude);
        var [ x, y, z ] = sun;

        TWEEN.removeAll();
        var sunTween = new TWEEN.Tween(this.sun.position);
        sunTween
            .to({ x, y, z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        return this;
    }

    render3d() {
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
        return this;
    }

    animate() {
        this.render3d();
        requestAnimationFrame(this.animate.bind(this));
    }

    renderBuilding({outlinePath, levels, isPub}) {
        var points = this.convertPoints(outlinePath);
        var shape = new THREE.Shape();
        var material = BUILDING_MATERIAL;
        var amount = levels * 4.5

        if(isPub) {
            material = PUB_MATERIAL;
            amount += 1;
        } else {
            //amount += Math.random();
        }

        var extrudeSettings = {
            ...EXTRUDE_SETTINGS,
            amount
        }

        // Starting point, last coordinate
        shape.moveTo(points[points.length-1][0], points[points.length-1][1]);

        // Add points to the shape
        points.forEach(xy => {
            shape.lineTo(xy[0], xy[1]);
        });

        var geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        var mesh = new THREE.Mesh(geom, material);

        geom.computeFaceNormals();

        //mesh.rotation.x = -Math.PI/2;
        // Rotate so south is down
        mesh.rotation.z = -Math.PI/2;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = Math.random() + '-' + Math.random();

        this.scene.add(mesh);

        this.building_refs.push(mesh.name);

        return this;
    }

    convertPoints(coords) {
        return coords.map(vector => this.convertProjection(vector));
    }

    /**
     * Get a D3 projection function for the current centre and zoom level
     * @returns function
     */
    getProjection() {
        const centre = [this.props.centre.lng, this.props.centre.lat];
        const TILESIZE = 128;
        return d3.geo.mercator()
            .center(centre)
            .translate([0, 0])
            .scale(TILESIZE << ZOOM);
    }

    /**
     * Convert a set of lat lng coordinates to pixel coorindates
     * for this rendering
     * @param coords Array [x, y]
     * @returns Array [y, x]
     */
    convertProjection(vector) {
        var pixelValue = this.getProjection()(vector); // Returns [x, y]
        // Flip it
        //return pixelValue;
        return [pixelValue[1] * -1, pixelValue[0] * -1];
    }
}

ThreeD.propTypes = {
    centre: React.PropTypes.shape({
      lat: React.PropTypes.number,
      lng: React.PropTypes.number
    }),
    date: React.PropTypes.instanceOf(Date)

}

export default ThreeD;
