import React from 'react';
import config from '../config';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import classNames from 'classNames';

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

    onMapClick(e){
        if(this.props.onPlaceClick){
            this.props.onPlaceClick(e.placeId);
        }
    }

    render() {
        const controllable = this.props.controllable || false;
        const classes = classNames('Map', this.props.className);
        return (

            <div className={classes} >
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
                            ref={(ref) => {
                                this.map = ref;
                                if(this.props.setMapRef)this.props.setMapRef(ref);
                            }}
                            defaultZoom={15}
                            defaultCenter={this.props.centre}
                            center={this.props.centre}
                            onClick={this.onMapClick.bind(this)}
                            options={{
                                mapTypeControl: controllable,
                                streetViewControl: controllable,
                                zoomControl: controllable,
                                draggable: controllable,
                                scrollwheel: controllable,
                                disableDoubleClickZoom: !controllable,
                                styles: config.MAP_CONFIG,
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
