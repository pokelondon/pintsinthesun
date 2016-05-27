import React from 'react';
import { Link } from 'react-router';

import Slider from 'rc-slider';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";


class Locate extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onDragEnd() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    render() {
        let { lat, lng } = this.props.centre;
        return (
            <div className="Map">
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
                                    zoomControl: true
                                }}
                                >
                            </GoogleMap>
                            }
                        />

                        <Link className="Button Button--primary" to='/pubs/'>
                            Find somewhere near here
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

