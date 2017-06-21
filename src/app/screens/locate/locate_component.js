import React from 'react';
import { Link } from 'react-router';
import LocationSearchContainer from '../../components/LocationSearch/LocationSearchContainer';
import PubNameSearchContainer from '../../components/PubNameSearch/PubNameSearchContainer';
import PubDetail from '../../components/PubDetail/PubDetail';
import { normaliseLatLng } from '../../utils/pintsUtils';

import ReactMapboxGl, {
    Layer,
    Feature,
    ZoomControl,
    Marker,
    Circle
} from "react-mapbox-gl";


import GA from 'react-ga';

import config from '../../config';

const MapBox = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoicmljaHBva2UiLCJhIjoiY2ozNDc2aWR3MDAxZjMycWtxcmh2MXh3ayJ9.osNPIJFwKW6lo-vQ216qwg"
});

const MARKER_IMG = {
    url: "/img/pint.png"
};

const MARKER_IMG_UNKNOWN = {
    url: "/img/unknown-marker.png"
};

class Locate extends React.Component {

    constructor(props) {
        super(props);

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMapDragEnd = this.onMapDragEnd.bind(this);
    }

    componentWillMount() {
        if(this.props.params.suggest === 'suggest') {
            this.props.shouldSuggest(true);
        }

        if(!this.props.locationHasBeenRequested) {
            this.props.fetchPosition();
        }
    }

    onMapDragEnd(ev) {
        this.props.onCenterChanged(ev.getCenter());
    }

    onZoomChanged(ev) {
        this.props.onZoomChanged(ev.getZoom());
    }

    onMarkerClick(foursquareID) {
        this.props.setCurrentPub(foursquareID);
    }

    getMarkers(locations) {

        if(!locations) {
            return;
        }

        let markers = [];
        for(var prop in locations) {
            const pub = locations[prop];
            let markerImg = MARKER_IMG_UNKNOWN.url;
            if(pub.known){
                markerImg = MARKER_IMG.url;
            }
            markers.push(
                <Marker
                    coordinates={[pub.location.coordinates[0], pub.location.coordinates[1]]}
                    anchor="center"
                    onClick={() => {this.props.setCurrentPub(pub.foursquareID)}}
                >
                    <img src={markerImg}/>
                </Marker>
            );
        }
        return markers;
    }

    getCirclePaint() {
        return {
            'circle-radius': {
                'base': 1.75,
                'stops': [[15, 28], [19, 490]]
            },
            'circle-color': '#FFFFFF',
            'circle-opacity': 0.1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
        }
    }



    getFocusCircle() {
        if(this.props.pub) {
            const location = this.props.pub.location;
            return (
                <Layer
                  id="focus-circle"
                  type="circle"
                  paint={this.getCirclePaint()}
                >
                    <Feature onClick={() => {console.log('clickkkkkky');}} coordinates={this.props.pub.location.coordinates} />
                </Layer>
            )
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
                                    <MapBox
                                        style="mapbox://styles/richpoke/cj3478cqk002g2sqecso4xnz9"
                                        containerStyle={{
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        center={[this.props.centre.lng, this.props.centre.lat]}
                                        zoom={[this.props.mapZoomLevel]}
                                        onDragEnd={this.onMapDragEnd}
                                        onZoomEnd={this.onZoomChanged}
                                        movingMethod="flyTo"
                                        dragRotate={false}
                                    >
                                        <ZoomControl />
                                        {this.getMarkers(this.props.filteredPubs)}
                                        {this.getFocusCircle()}
                                    </MapBox>

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
                                isSliderTipVisible={this.props.isSliderTipVisible}
                                hideSliderTip={this.props.hideSliderTip}
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
    filteredPubs: React.PropTypes.object
}

export default Locate;

/*}<GoogleMapLoader
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
/>*/
