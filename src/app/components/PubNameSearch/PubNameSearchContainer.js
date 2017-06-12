import React from 'react';
import { connect } from 'react-redux'
import PubNameSearchComponent from './PubNameSearchComponent';
import * as pubNameSearchActions from '../../actions/pubNameSearch';

const mapStateToProps = (state, ownProps) => {
    const { pubNameSearch } = state;
    return {
        hasError: pubNameSearch.hasError,
        searchResults: pubNameSearch.searchResults,
        isGeocoding: pubNameSearch.isSearching
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doSearch: (term, near) => {
            dispatch(pubNameSearchActions.doSearch(term, near));
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(PubNameSearchComponent);