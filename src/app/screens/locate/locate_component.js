import React from 'react';
import { Link } from 'react-router';

import SunCalc from '../../lib/suncalc';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import AngleMarker from '../../components/anglemarker';

class Locate extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        //let pos = SunCalc.getPosition(this.state.date, this.state.centre.lat, this.state.centre.lng);
        //let angle = pos.azimuth * 180 / Math.PI;
        //this.setState({angle});
    }

    onDragEnd() {
        console.log('dragend');
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
    angle: React.PropTypes.number
}

export default Locate;

