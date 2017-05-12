import React from 'react';
import { searchPubs } from '../../services/googlemaps';
import classNames from 'classnames';
import config from '../../config';
import { testIsPub } from '../../utils/pintsUtils';
import PubSearchResultList from './PubSearchResultList';
import PubSearchResult from './PubSearchResult';

class PubSearch extends React.Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     searchTerm: '',
        //     selectedSearchResultIndex: -1,
        //     textFieldIsFocussed: false,
        //     isActive: false
        // }

        //this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
        //this.onSearchFocus = this.onSearchFocus.bind(this);
        // this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        // this.onSearchChange = this.onSearchChange.bind(this);
    }


    /**
    * Handle typing in search box and search immediately
    * @param {SyntheticEvent} e - the key event
    */
    onSearchChange(e) {
        this.doSearch(e.target.value);
    }


    /**
    * Perform the search
    * @param {string} term - search term to use
    */
    doSearch(term){
        this.setState({
            searchTerm: term,
            selectedSearchResultIndex: -1
        });

        //get the bounds of the current map, so the search weights on this area
        const bounds = this.props.getMapRef().getBounds();
        searchPubs(term, bounds, (results) => {
            this.setState({
                searchResults: results
            });
        });
    }


    /**
    * Handle submit of search form
    * @param {SyntheticEvent} e - the event
    */
    // onSearchFormSubmit(e) {
    //     e.preventDefault();
    //     this.doSearch(this.state.searchTerm);
    // }


    /**
    * Handle focus on search field
    */
    // onSearchFocus(){
    //     this.setState({isActive: true});
    // }


    /**
    * Focus on a search result on rollover
    * @param {number} index - the index number of the search result
    */
    // onSearchResultRollover(index){
    //     this.setState({selectedSearchResultIndex: index});
    // }


    /**
    * Focus on a location on click.
    * Also dismiss the results bu setting active to false
    * @param {number} index - the index number of the search result
    */
    // onSearchResultClick(placeID) {
    //     this.setState({isActive: false});
    //     this.props.focusOnLocation(placeID)
    // }


    /**
    * Build the results list
    * @return {JSX} the results list
    */
    // getResultList() {
    //     let resultList;
    //
    //     if(!this.props.searchResults && !this.state.placeID && this.props.searchTerm.length && this.state.isActive) {
    //         resultList = <PubSearchResultList>No results :(</PubSearchResultList>
    //     }
    //
    //     if(this.props.searchResults && this.props.searchTerm.length && this.state.isActive) {
    //
    //         const results = this.props.searchResults.map ( (result, idx) => {
    //             const classes = classNames({
    //                 'Search-result': true,
    //                 'Search-result--active': idx === this.props.selectedSearchResultIndex,
    //                 'Search-result--isPub': testIsPub(result.types)
    //             });
    //             return <div className={classes} onMouseOver={() => this.onSearchResultRollover(idx)} onClick={() => this.onSearchResultClick(result.place_id)} key={result.place_id}>{result.description}</div>
    //         });
    //         resultList = <PubSearchResultList>{results}</PubSearchResultList>
    //     }
    //     return resultList;
    // }


    render() {

        let resultList;

        if(!this.props.searchResults && !this.props.placeID && this.props.searchTerm.length && this.props.isSearchActive) {
            resultList = <PubSearchResultList>No results :(</PubSearchResultList>
        }

        if(this.props.searchResults && this.props.searchTerm.length && this.props.isSearchActive) {

            const results = this.props.searchResults.map ( (result, idx) => {
                const classes = classNames({
                    'Search-result': true,
                    'Search-result--active': idx === this.props.selectedSearchResultIndex,
                    'Search-result--isPub': testIsPub(result.types)
                });

                return (
                    <PubSearchResult
                        cssClasses={classes}
                        placeID={result.place_id}
                        onRollover={this.props.focusOnResultIndex}
                        onClick={this.props.focusOnLocation}
                        description={result.description}
                        key={result.place_id}
                        index={idx}
                    />
                );
            });
            resultList = <PubSearchResultList>{results}</PubSearchResultList>
        }

        return (
            <div>
                {this.props.children}
                <form onSubmit={(e) => {e.precventDefault()}} className="Box Box-row">
                    <input
                        type="search"
                        className="Input--search Box-item flex-2"
                        onFocus={(e) => {this.props.setSearchIsActive(true)}}
                        onKeyDown={(e) => {this.props.onSearchKeyDown(e)}}
                        onChange={(e) => {this.props.searchPub(e.target.value, this.props.getMapRef().getBounds())}}
                        value={this.props.searchTerm}
                        placeholder="e.g Barley Mow, Marlyebone"
                    />
                    <div className="Box-item Box-item--noPadding flex-1">
                        <button className="Button--secondary">Search</button>
                    </div>
                </form>
                {resultList}
            </div>
        )
    }
}

PubSearch.propTypes = {
    getMapRef: React.PropTypes.func.isRequired,
    focusOnLocation: React.PropTypes.func.isRequired,
}

export default PubSearch;