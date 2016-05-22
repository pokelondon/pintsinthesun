import React from 'react';
import { Link } from 'react-router'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
    }

    onCenterChanged() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    render() {
        return (
            <div className="Map">
                <GoogleMapLoader
                    containerElement={(
                        <div
                            {...this.props}
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
                                onCenterChanged={centre => this.onCenterChanged()}
                                >
                            </GoogleMap>
                            }
                        />
                </div>
        )
    }
}

Map.propTypes = {
    onCenterChanged: React.PropTypes.func.isRequired,
}

export default Map
