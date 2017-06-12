import React, { Component, PropTypes } from 'react';
import GA from 'react-ga';

class PubNameSearchComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchNear: '',
        }

        this.onSearchTermChange = this.onSearchTermChange.bind(this);
        this.onSearchNearChange = this.onSearchNearChange.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    onSearchTermChange(e) {
        this.setState({searchTerm: e.target.value})
    }

    onSearchNearChange(e) {
        this.setState({searchNear: e.target.value})
    }

    doSearch(e) {
        e.preventDefault();
        this.props.doSearch(this.state.searchTerm, this.state.searchNear);
    }

    getResults() {
        if(this.props.results) {
            return this.props.results.map((result) => {
                return(<div>result</div>)
            });
        }
    }

    render() {
        return (
            <div className="max-width">
                <p className="Para--large">Find a pub by name</p>
                <form className="Box Box-row" onSubmit={this.doSearch}>
                        <input className="Input--search Box-item flex-2" onChange={this.onSearchTermChange} type="search" value={this.state.searchTerm} placeholder="Pub Name" />
                        <input className="Input--search Box-item flex-2" onChange={this.onSearchNearChange} type="search" value={this.state.searchNear} placeholder="Near" />
                        <div className="Box-item Box-item--noPadding flex-1">
                            <button type="submit" className="Button--secondary" onClick={this.doSearch}>Search</button>
                        </div>
                </form>
                {this.getResults()}
            </div>
        );
    }
}

PubNameSearchComponent.propTypes = {
    getMapBounds: PropTypes.func.isRequired,
    onCenterChanged: PropTypes.func.isRequired,
};

export default PubNameSearchComponent;