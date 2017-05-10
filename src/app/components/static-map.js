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

class StaticMap extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.centre, this.props.centre);
        if(nextProps.centre.lat !== this.props.centre.lat && nextProps.centre.lng !== this.props.centre.lng) {
            setTimeout(() => {
                this.offsetMap();
            }, 100);
        }
    }

    onMapClick(e){
        if(this.props.onPlaceClick){
            this.props.onPlaceClick(e.placeId);
        }
    }

    setMapRef(ref) {
        this.map = ref;
        if(this.props.setMapRef)this.props.setMapRef(ref);
    }

    offsetMap() {
        if(this.props.offsetPin) {
            if(window.matchMedia("(min-width: 400px)").matches) {
                this.map.panBy(-200, 0);
            } else {
                this.map.panBy(0, -50);
            }
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
                            ref={(ref) => this.setMapRef(ref)}
                            defaultZoom={15}
                            defaultCenter={this.props.centre}
                            center={this.props.centre}
                            onClick={this.onMapClick.bind(this)}
                            options={{
                                mapTypeControl: false,
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

StaticMap.defaultProps = {
    offsetPin: false
}

export default StaticMap;
