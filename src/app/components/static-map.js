import React from 'react';
import config from '../config';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

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
                                zoomControl: true,
                                styles: config.MAP_CONFIG
                            }}>
                            <Marker
                                position={this.props.centre}
                            />
                        </GoogleMap>
                    }
                />

            </div>

        )
    }
}
