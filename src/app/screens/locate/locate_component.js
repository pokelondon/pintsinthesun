import React from 'react';
import { Link } from 'react-router';
// import { geocode, reverseGeocode } from '../../services/googlemaps.js';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import Map from '../../components/Map/Map';
import LocationSearch from '../../components/LocationSearch/LocationSearch';
import PubDetail from '../../components/PubDetail/PubDetail';

import GA from 'react-ga';

import config from '../../config';

const MARKER_IMG = {
    url: "/img/pint.png",
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(25, 50)
};

const MARKER_IMG_GREY = {
    url: "/img/pint-grey.png",
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(25, 50)
};

class Locate extends React.Component {

    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    onDragEnd() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    onMarkerClick(idx) {
        this.props.setCurrentPub(idx);
    }

    getMarkers(locations) {

        if(!locations) {
            return;
        }

        const markers = locations.map((locationObj, idx) => {

            let latLng = {lat: locationObj.location.coordinates[1], lng: locationObj.location.coordinates[0]};
            let markerImg = MARKER_IMG_GREY;
            if(locationObj.known){
                markerImg = MARKER_IMG;
            }
            return (
                <Marker key={idx}
                    position={latLng}
                    onClick={() => {this.onMarkerClick(idx)}}
                    icon={markerImg}
                />
            )
        });

        return markers;
    }

    render() {

        let { lat, lng } = this.props.centre;
        return (
            <div className="Screen Locate">
                <header className="Screen-header">
                    <LocationSearch
                        getMapBounds={() => {return this.map.props.map.getBounds()}}
                        onCenterChanged={this.props.onCenterChanged}
                        fetchPosition={this.props.fetchPosition}
                    />
                </header>

                <div className="Screen-main">
                    <div className="max-width">
                        <div className="Box Box-row">
                            <div className="Box-item Box-item--noPadding">
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
                                                center={this.props.centre}
                                                options={{
                                                    mapTypeControl: false,
                                                    streetViewControl: false,
                                                    zoomControl: true,
                                                    styles: config.MAP_CONFIG
                                                }}
                                                >
                                                {this.getMarkers(this.props.filteredPubs)}
                                            </GoogleMap>
                                        }
                                    />

                                </div>
                            </div>
                        </div>

                        {this.props.pub &&
                            <PubDetail
                                pub={this.props.pub}
                                date={this.props.date}
                                updateTime={this.props.updateTime}
                            />
                        }

                    </div>
                </div>
            </div>
        )
    }
}

Locate.propTypes = {
    fetchPosition: React.PropTypes.func,
    isLocating: React.PropTypes.bool,
    centre: React.PropTypes.shape({
        lat: React.PropTypes.number,
        lng: React.PropTypes.number
    }),
    onCenterChanged: React.PropTypes.func,
    filteredPubs: React.PropTypes.array,
    items: React.PropTypes.array,
}

export default Locate;
