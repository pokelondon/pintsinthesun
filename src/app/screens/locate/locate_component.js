import React from 'react';
import { Link } from 'react-router';

import SunCalc from '../../lib/suncalc';
import Slider from 'rc-slider';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import AngleMarker from '../../components/anglemarker';

class Locate extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentWillReceiveProps(newProps) {
    }

    onSliderChange(value) {
        this.props.updateAngle(value);
    }

    onDragEnd() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    render() {
        let { lat, lng } = this.props.centre;
        return (
            <div className="Map">
                <AngleMarker angle={this.props.angle} />

                <GoogleMapLoader
                    containerElement={(
                        <div
                            style={{
                                height: "100%",
                            }}
                        />
                        )}
                        googleMapElement={
                            <GoogleMap
                                ref={(map) => this.map = map}
                                defaultZoom={15}
                                defaultCenter={this.props.centre}
                                onDragend={this.onDragEnd.bind(this)}
                                options={{
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                    zoomControl: false
                                }}
                                >
                            </GoogleMap>
                            }
                        />

                        <p>{lat}, {lng}</p>

                        <Slider
                            min={-150}
                            max={150}
                            step={1}
                            included={false}
                            defaultValue={this.props.angle}
                            className='Slider'
                            onChange={this.onSliderChange.bind(this)}
                        />

                        <Link className="Button Button--primary" to={`/pubs/${lat}/${lng}`}>
                            Find somewhere NOW
                        </Link>
                    </div>
        )
    }
}

Locate.propTypes = {
    fetchPosition: React.PropTypes.func,
    centre: React.PropTypes.shape({
      lat: React.PropTypes.number,
      lng: React.PropTypes.number
    }),
    onCenterChanged: React.PropTypes.func,
    updateAngle: React.PropTypes.func,
    angle: React.PropTypes.number
}

export default Locate;

