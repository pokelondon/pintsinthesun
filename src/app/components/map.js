import React from 'react';
import { Link } from 'react-router'
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            markers: []
        }
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
                                ref={(map) => console.log(map)}
                                defaultZoom={15}
                                defaultCenter={{lat: 51.54, lng: -0.064922}}
                                >
                                {this.state.markers.map((marker, index) => {
                                    return (
                                        <Marker
                                            {...marker}
                                            onRightclick={this.handleMarkerRightclick.bind(this, index)} />
                                        );
                                })}
                            </GoogleMap>
                            }
                        />
                </div>
        )
    }
}
