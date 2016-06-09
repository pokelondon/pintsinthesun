import React, { Component, PropTypes } from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

const MARKER_IMG = {
    url: "img/pint.png",
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(25, 50)
};

const MARKER_IMG_GREY = {
    url: "img/pint-grey.png",
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(25, 50)
};

const DEFAULT_ZOOM = 15;


export default class Map extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {zoom: DEFAULT_ZOOM};

    }

    render() {

        return (

            <GoogleMapLoader
                containerElement={
                    <div style={{height: "100%"}} />
                }

                googleMapElement={
                    <GoogleMap
                        ref={(map) => this.map = map}
                        defaultZoom={this.state.zoom}
                        zoom={this.state.zoom}
                        center={this.props.centre}
                        defaultCenter={this.props.centre}
                        onDragend={this.onDragEnd.bind(this)}
                        onZoomChanged={this.onZoomChanged.bind(this)}
                        mapTypeId={google.maps.MapTypeId.SATELLITE}
                        >
                        {this.getMarkers(this.props.locations)}
                    </GoogleMap>
                }
            />

        )
    }


    /**
     *  Returns an array of marker components, given an array of locations
     *
     * @param {array} locations
     */
    getMarkers(locations) {

        let markers = locations.map((locationObj, index) => {

            let latLng = {lat: locationObj.location.lat, lng: locationObj.location.lng};
            let markerImg = MARKER_IMG_GREY;
            if(locationObj.exists){
                markerImg = MARKER_IMG;
            }
            return (
                <Marker key={index}
                    position={latLng}
                    onClick={this.onMarkerClick.bind(this, locationObj)}
                    icon={markerImg}
                />
            )
        });

        return markers;
    }


    onDragEnd() {
        let centre = this.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }


    onMarkerClick(locationObj) {
        this.props.onLocationSelect(locationObj);
        this.setState({zoom: 19});

    }

    onZoomChanged(){
        this.setState({zoom: this.map.getZoom()});
    }


}