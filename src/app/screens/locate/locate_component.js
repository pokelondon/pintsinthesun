import React from 'react';
import { Link } from 'react-router';

import Slider from 'rc-slider';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";


class Locate extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onDragEnd() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    componentWillReceiveProps(nextProps) {
        //if(this.props.centre.lat != nextProps.centre.lat) {
            //let { lat, lng } = nextProps.centre;
            //let ll = new google.maps.LatLng(lat, lng);
            //this.map.props.map.panTo(ll);
        //}
    }

    render() {
        let { lat, lng } = this.props.centre;
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
                                onDragend={this.onDragEnd.bind(this)}
                                center={this.props.centre}
                                options={{
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                    zoomControl: true
                                }}
                                >
                            </GoogleMap>
                            }
                        />

                    <p></p>
                    <Link
                        to='/pubs'
                        className="Button Button--primary"
                        >
                        Find somewhere near here {this.props.filteredPubs.length}/{this.props.items.length}
                    </Link>
                    <button
                        className="Button"
                        onClick={this.props.fetchPosition}>
                        {(this.props.isLocating) ? 'Locating' : 'Locate Me'}
                    </button>
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

