import React from 'react';
import { connect } from 'react-redux'
import LocationSearchComponent from './LocationSearchComponent';
import * as geocodeActions from '../../actions/geocode';

const mapStateToProps = (state, ownProps) => {
    const { geocode } = state;
    return {
        hasError: geocode.hasError,
        hasZeroResults: geocode.hasZeroResults,
        isGeocoding: geocode.isGeocoding
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doSearch: (term) => {
            dispatch(geocodeActions.geocodeSearch(term, ownProps.getMapBounds()));
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(LocationSearchComponent);