import React from 'react';
import config from '../config';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

const MARKER_IMG = {
    url: "/img/icons/map-pin.png",
    scaledSize: new google.maps.Size(28.8, 40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(14.4, 40)
};

export default class StaticMap extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }


    render() {

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
                            center={this.props.centre}
                            options={{
                                mapTypeControl: false,
                                streetViewControl: false,
                                zoomControl: false,
                                draggable: false,
                                scrollwheel: false,
                                disableDoubleClickZoom: true,
                                styles: config.MAP_CONFIG
                            }}>
                            <Marker
                                position={this.props.centre}
                                icon={MARKER_IMG}
                            />
                        </GoogleMap>
                    }
                />

            </div>

        )
    }
}
