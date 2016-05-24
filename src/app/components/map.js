import React from 'react';
import { Link } from 'react-router'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

import AngleMarker from './anglemarker';

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.state = {
            angle: 0
        }
    }

    onCenterChanged() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    /**
     * Something being updated.
     * Not for init.
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps.hasOwnProperty('centre')) {
            if (nextProps.centre != this.props.centre) {
                this.map.props.map.panTo(nextProps.centre);
            }
        }
    }

    render() {
        return (
            <div className="Map">
                <AngleMarker
                    angle={this.props.angle}
                    onIncrement={this.props.onIncrement}
                    onDecrement={this.props.onDecrement} />

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
                                options={{
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                    zoomControl: false
                                }}
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
