import React, { Component, PropTypes } from 'react';
import GA from 'react-ga';

class LocationSearch extends Component {

    constructor(props) {
        super(props);
        this.state = { searchTerm: '' }

        this.onSearchChange = this.onSearchChange.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    onSearchChange(e) {
        this.setState({searchTerm: e.target.value})
    }

    doSearch(e) {
        e.preventDefault();
        this.props.doSearch(this.state.searchTerm);
    }

    render() {
        return (
            <div className="max-width">
                <p className="Para--large">Search for your location, or drag the map</p>
                <form className="Box Box-row" onSubmit={this.doSearch}>
                        <button type="button" onClick={this.props.fetchPosition} className="Button--secondary Button--locateMe flex-none"></button>
                        <input className="Input--search Box-item flex-2" onChange={this.onSearchChange} type="search" value={this.state.searchTerm} placeholder="e.g E1 6LG" />
                        <div className="Box-item Box-item--noPadding flex-1">
                            <button type="submit" className="Button--secondary" onClick={this.doSearch}>Search</button>
                        </div>
                </form>
                {this.props.hasZeroResults &&
                    <div className="Box Box-row">
                        <div className="Box Box-item">
                            <div>No results :(</div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

LocationSearch.propTypes = {
    getMapBounds: PropTypes.func.isRequired,
    onCenterChanged: PropTypes.func.isRequired,
    fetchPosition: PropTypes.func.isRequired,
    doSearch: PropTypes.func
};

export default LocationSearch;