import React from 'react';
import { Link } from 'react-router';
import {
    GoogleMapLoader,
    GoogleMap,
    Marker,
    Circle
} from "react-google-maps";
import Map from '../../components/Map/Map';
import LocationSearchContainer from '../../components/LocationSearch/LocationSearchContainer';
import PubNameSearchContainer from '../../components/PubNameSearch/PubNameSearchContainer';
import PubDetail from '../../components/PubDetail/PubDetail';
import { normaliseLatLng } from '../../utils/pintsUtils';

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

const MARKER_IMG_UNKNOWN = {
    url: "/img/unknown-marker.png",
    scaledSize: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10)
};

class Locate extends React.Component {

    constructor(props) {
        super(props);

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onZoomChanged = this.onZoomChanged.bind(this);
    }

    componentWillMount() {
        if(this.props.params.suggest === 'suggest') {
            this.props.shouldSuggest(true);
        }

        if(!this.props.locationHasBeenRequested) {
            this.props.fetchPosition();
        }
    }

    onDragEnd() {
        const centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    onZoomChanged() {
        const zoom = this.map.props.map.getZoom();
        this.props.onZoomChanged(zoom);
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
            let markerImg = MARKER_IMG_UNKNOWN;
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

    getFocusCircle() {
        if(this.props.pub) {
            const pubCentre = normaliseLatLng(this.props.pub.location.coordinates);
            return (<Circle
                radius={50}
                center={pubCentre}
                options={{
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: '#ffffff',
                    fillOpacity: 0.1,
                }}
            />);
        }
        return null;
    }

    render() {

        let { lat, lng } = this.props.centre;
        return (
            <div className="Screen Locate">
                <header className="Screen-header">
                    <LocationSearchContainer
                        getMapBounds={() => {return this.map.props.map.getBounds()}}
                        onCenterChanged={this.props.onCenterChanged}
                        fetchPosition={this.props.fetchPosition}
                    />
                    {/*
                    <PubNameSearchContainer
                        getMapBounds={() => {return this.map.props.map.getBounds()}}
                        onCenterChanged={this.props.onCenterChanged}
                    />*/}
                </header>

                <div className="Screen-main">
                    <div className="max-width">
                        {this.props.isLocating &&
                            <div className="Box Box-row">
                                <div className="Box Box-item">
                                    <p>Finding your location...</p>
                                </div>
                            </div>
                        }
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
                                                ref={map => this.map = map}
                                                defaultZoom={this.props.mapZoomLevel}
                                                zoom={this.props.mapZoomLevel}
                                                defaultCenter={this.props.centre}
                                                onDragend={this.onDragEnd.bind(this)}
                                                onZoomChanged={this.onZoomChanged}
                                                center={this.props.centre}
                                                options={{
                                                    mapTypeControl: false,
                                                    streetViewControl: false,
                                                    zoomControl: true,
                                                    styles: config.MAP_CONFIG,
                                                    gestureHandling: 'greedy'
                                                }}
                                                >
                                                {this.getMarkers(this.props.filteredPubs)}
                                                {this.getFocusCircle()}
                                            </GoogleMap>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {this.props.pub &&
                            <div className="Box Box-row">
                                <div className="Box Box-item">
                                    <p>{this.props.pub.name.toUpperCase()}</p>
                                </div>
                            </div>
                        }

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
