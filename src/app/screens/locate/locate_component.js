import React from 'react';
import { Link } from 'react-router';
import { geocode, reverseGeocode } from '../../services/googlemaps.js';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

import GA from 'react-ga';

import config from '../../config';


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
        this.setState({errorMsg: null});

        geocode(this.state.searchTerm, (result) => {
            if(result.status === 'OK'){
                this.props.onCenterChanged(result.centre);
            } else
            if(result.status == 'ZERO_RESULTS')
                this.setState({errorMsg: 'No results :('});
            else {
                this.setState({errorMsg: 'Oops - Something went wrong. Please try again.'});
            }
        });

        GA.event({
            category: 'Filter',
            action: 'Search'
        });
        GA.pageview(`/search?q=${this.state.searchTerm}`);
    }

    render() {

        var btnCopy;
        if(this.props.filteredPubs.length){
            btnCopy = `Find somewhere near here (${this.props.filteredPubs.length} found)`;
        } else {
            btnCopy = 'No pubs found near here :(';
        }

        var errorMsg;
        if(this.state.errorMsg){
            errorMsg = <div className="Box Box-row">
                <div className="Box-item">{this.state.errorMsg}</div>
            </div>
        }

        let { lat, lng } = this.props.centre;
        return (
            <div className="Screen Locate">
                <header className="Screen-header">
                    <div className="max-width">
                        <p className="Para--large">Search for your location, or drag the map</p>
                        <form className="Box Box-row" onSubmit={this.doSearch.bind(this)}>
                                <button type="button" onClick={this.props.fetchPosition} className="Button--secondary Button--locateMe flex-none"></button>
                                <input className="Input--search Box-item flex-2" onChange={this.onSearchChange.bind(this)} type="search" value={this.state.searchTerm} placeholder="e.g E1 6LG" />
                                <div className="Box-item Box-item--noPadding flex-1">
                                    <button type="submit" className="Button--secondary" onClick={this.doSearch.bind(this)}>Search</button>
                                </div>
                        </form>
                        {errorMsg}
                    </div>
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
                                            </GoogleMap>
                                        }
                                    />
                                    <div className="LocationMarker"></div>
                                </div>
                            </div>
                        </div>
                        <div className="Box Box-row">
                            <div className="Box-item Box-item--noPadding">
                                <Link
                                   onClick={this.props.onClose}
                                   to='/pubs'
                                   className="Button Button--primary"
                                   >
                                   {btnCopy}
                               </Link>
                            </div>
                        </div>
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
