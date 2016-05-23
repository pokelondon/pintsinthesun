import React from 'react';
import THREE from 'three';
import SunCalc from '../lib/suncalc';


const GREYDARK = 0x434A54;
const RED = 0xDA4453;
const GREEN = 0x48CFAD;
const YELLOW = 0xF6BB42;
const BLUE = 0x4FC1E9;
const WHITE = 0xFFFFFF;

const PUB_MATERIAL = new THREE.MeshLambertMaterial({color: YELLOW});
const BUILDING_MATERIAL = new THREE.MeshLambertMaterial({color: GREYDARK});

const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;
const CAMERA_DISTANCE = 400;
const SUN_DISTANCE = 400;

function angles2cartesian(azimuth, altitude) {
    var radius = SUN_DISTANCE;
    var x = radius * Math.cos(altitude) * Math.sin(azimuth) * -1;
    var y = radius * Math.sin(altitude);
    var z = radius * Math.cos(altitude) * Math.cos(azimuth);

    return [x, y, z];
}


class ThreeD extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        this.WIDTH = 200;
        this.HEIGHT = 200;

            // set some camera attributes
        const ASPECT = this.WIDTH / this.HEIGHT;

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({clearColor: '#ccc', antialias: true});
        this.scene.add(this.camera);

        this.camera.position.z = 1;
        this.camera.position.x = 0;
        this.camera.position.y = CAMERA_DISTANCE;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.rotation.z = 0;

        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.soft = true;

        this.refs.canvas.appendChild(this.renderer.domElement);

        this.createFloor()
            .createLights()
            .updateSunPosition()
            .render3d();
    }

    render() {
        return (
            <div
                className="Render"
                ref='canvas'
                width="200"
                height="200"
            />
        )
    }

    createFloor() {
        const planeGeo = new THREE.PlaneGeometry(400, 400, 10, 10);
        const planeMat = new THREE.MeshLambertMaterial({color: 0xffffff});

        this.plane = new THREE.Mesh(planeGeo, planeMat);
        this.plane.side = THREE.DoubleSide;
        this.plane.receiveShadow = true;

        // rotate it to correct position
        this.plane.rotation.x = -Math.PI/2;
        this.scene.add(this.plane);
        return this;
    }

    createLights() {
        // add a light at a specific position
        this.sun = new THREE.SpotLight(WHITE);
        this.scene.add(this.sun);
        this.sun.castShadow = true;
        //this.sun.onlyShadow = true;
        this.sun.shadow.mapSize.width = this.WIDTH * 2;
        this.sun.shadow.mapSize.height = this.HEIGHT * 2;
        return this;
    }

    updateSunPosition() {
        let { lat, lng } = this.props.centre;
        var pos = SunCalc.getPosition(this.props.date, lng, lat);
        var sun = angles2cartesian(pos.azimuth, pos.altitude);

        this.sun.position.x = sun[0];
        this.sun.position.y = sun[1] + 100;
        this.sun.position.z = sun[2];
        return this;
    }

    render3d() {
        this.renderer.render(this.scene, this.camera);
        return this;
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
