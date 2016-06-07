import React from 'react';
import { Link } from 'react-router';
import { geocode } from '../../services/googlemaps.js';

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

import GA from 'react-ga';

import config from '../../config';
console.log(config.MAP_CONFIG);


class Locate extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            searchTerm: ''
        };

        GA.modalview('/locate');

    }

    onDragEnd() {
        let centre = this.map.props.map.getCenter();
        this.props.onCenterChanged({lat: centre.lat(), lng: centre.lng()});
    }

    onSearchChange(e) {
        this.setState({searchTerm: e.target.value})
    }

    doSearch(e) {
        e.preventDefault();
        geocode(this.state.searchTerm, (centre) => {
            this.props.onCenterChanged(centre);
        });

        GA.event({
            category: 'Filter',
            action: 'Search'
        });
        GA.pageview(`/search?q=${this.state.searchTerm}`);
    }

    render() {

        let { lat, lng } = this.props.centre;
        return (
            <div class="Locate">

                <div className="Box">
                    <form className="Box-row" onSubmit={this.doSearch.bind(this)}>
                        <input className="Input--search Box-item--right" onChange={this.onSearchChange.bind(this)} type="search" value={this.state.searchTerm} placeholder="Postcode / Street name" />
                        <button type="submit" className="Button Box-item--right" onClick={this.doSearch.bind(this)}>Search</button>
                        <button className="Button--close" onClick={this.props.onClose}>&times;</button>
                    </form>
                </div>

                <div className="Box">
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
                                </GoogleMap>
                            }
                        />
                        <div className="LocationMarker"></div>
                    </div>
                </div>

                <div className="Box">
                    <Link
                       onClick={this.props.onClose}
                       to='/pubs'
                       className="Button Button--primary"
                       >
                       Find somewhere near here {this.props.filteredPubs.length}/{this.props.items.length}
                   </Link>
               </div>
                <div className="Box">
                    <button
                        className="Button"
                        onClick={this.props.fetchPosition}>
                        {(this.props.isLocating) ? 'Locating' : 'Locate Me'}
                    </button>
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
