import React from 'react';
import { connect } from 'react-redux'
import PubSearchComponent from './PubSearchComponent';
import * as addPubActions from '../../actions/addPub';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state, ownProps) => {
    const {
        searchTerm,
        searchResults,
        selectedSearchResultIndex,
        isSearchActive,
    } = state.addPub;
    return {
        searchTerm,
        searchResults,
        selectedSearchResultIndex,
        isSearchActive,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        searchPub: (searchTerm, bounds) => {
            dispatch(addPubActions.searchPub(searchTerm));
            dispatch(addPubActions.fetchSearchPubResults(searchTerm, bounds));
        },
        onSearchKeyDown: (e) => {
            if(e.key === 'ArrowDown'){
                e.preventDefault();
                dispatch(addPubActions.moveSelectedSearchResult(1));
            }
            if(e.key === 'ArrowUp'){
                e.preventDefault();
                dispatch(addPubActions.moveSelectedSearchResult(-1));
            }
            if(e.key === 'Enter'){
                e.preventDefault();
                dispatch(addPubActions.focusOnLocationByKey());
            }

        },
        focusOnResultIndex: (idx) => {
            dispatch(addPubActions.setSelectedSearchResult(idx));
        },
        focusOnLocation: (placeID) => {
            dispatch(addPubActions.focusOnLocation(placeID));
        },
        setSearchIsActive: (bool) => {
            dispatch(addPubActions.setSearchIsActive(bool));
        },
        focusOnSearchInput: () => {
            dispatch(addPubActions.focusOnSearchInput());
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(PubSearchComponent);