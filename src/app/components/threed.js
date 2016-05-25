import React from 'react';
import THREE from 'three';
import SunCalc from '../lib/suncalc';
import d3 from 'd3';


const GREYDARK = 0x434A54;
const RED = 0xDA4453;
const GREEN = 0x48CFAD;
const YELLOW = 0xF6BB42;
const BLUE = 0x4FC1E9;
const WHITE = 0xFFFFFF;

const PUB_MATERIAL = new THREE.MeshLambertMaterial({color: YELLOW});
const BUILDING_MATERIAL = new THREE.MeshPhongMaterial({
    color: GREYDARK,
    shininess: 10,
    specular: WHITE,
    shading: THREE.SmoothShading
});

const FLOOR_MATERIAL = new THREE.MeshLambertMaterial({
    color: BLUE,
});

const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;
const SUN_DISTANCE = 200;
const CAMERA_DISTANCE = 250;
const ZOOM = 16;
const EXTRUDE_SETTINGS = {bevelEnabled: false, material: 0, extrudeMaterial: 1};


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
        this.WIDTH = 400;
        this.HEIGHT = 400;

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
            .animate();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.buildings.length > 0) {
            nextProps.buildings.forEach(building => this.renderBuilding(building));
        }

        this.updateSunPosition();
    }

    shouldComponentUpdate() {
        return false;
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

        this.plane = new THREE.Mesh(planeGeo, FLOOR_MATERIAL);
        //this.plane.side = THREE.DoubleSide;
        this.plane.receiveShadow = true;

        // rotate it to correct position
        this.plane.rotation.x = -Math.PI/2;
        this.scene.add(this.plane);
        return this;
    }

    createLights() {
        var ambient = new THREE.AmbientLight(0x404040);
        this.scene.add(ambient);
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
        var pos = SunCalc.getPosition(this.props.date, lat, lng);
        var sun = angles2cartesian(pos.azimuth, pos.altitude);
        //console.log((pos.azimuth - (0.5 * Math.PI)) * (360 / (2 * Math.PI)));

        this.sun.position.x = sun[0];
        this.sun.position.y = sun[1];
        this.sun.position.z = sun[2];
        return this;
    }

    render3d() {
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
            amount += Math.random();
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

        mesh.rotation.x = -Math.PI/2;
        mesh.rotation.z = Math.PI/2;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);

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
