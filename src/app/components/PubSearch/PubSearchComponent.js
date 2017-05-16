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
    }

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
                    'Search-result--isPub': testIsPub(result.types),
                    'Search-result--exists': result.alreadyExists
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