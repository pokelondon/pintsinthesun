import React, { Component, PropTypes } from 'react';
import { geocode } from '../../services/googlemaps.js';
import GA from 'react-ga';

class LocationSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            errorMsg: null,
        }
    }

    onSearchChange(e) {
        this.setState({searchTerm: e.target.value})
    }

    doSearch(e) {
        e.preventDefault();
        this.setState({errorMsg: null});

        geocode(this.state.searchTerm, this.props.getMapBounds(), (result) => {
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
        return (
            <div className="max-width">
                <p className="Para--large">Search for your location, or drag the map</p>
                <form className="Box Box-row" onSubmit={this.doSearch.bind(this)}>
                        <button type="button" onClick={this.props.fetchPosition} className="Button--secondary Button--locateMe flex-none"></button>
                        <input className="Input--search Box-item flex-2" onChange={this.onSearchChange.bind(this)} type="search" value={this.state.searchTerm} placeholder="e.g E1 6LG" />
                        <div className="Box-item Box-item--noPadding flex-1">
                            <button type="submit" className="Button--secondary" onClick={this.doSearch.bind(this)}>Search</button>
                        </div>
                </form>
                {this.state.errorMsg}
            </div>
        );
    }
}

LocationSearch.propTypes = {
    getMapBounds: PropTypes.func.isRequired,
    onCenterChanged: PropTypes.func.isRequired,
    fetchPosition: PropTypes.func.isRequired,
};

export default LocationSearch;