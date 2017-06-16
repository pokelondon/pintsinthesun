import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as locateActions from '../../actions/locate';

import { getSelectedPubObj } from '../../reducers/position';

import Locate from './locate_component';

import GA from 'react-ga';

const mapStateToProps = (state, ownProps) => {
    const { centre, sun, items, filteredPubs, date, isLocating, locationHasBeenRequested, pub, mapZoomLevel } = state.position;
    const { angle } = state.locate;

    return {
        date,
        sun,
        centre,
        angle,
        items,
        filteredPubs,
        isLocating,
        locationHasBeenRequested,
        pub: getSelectedPubObj(state.position),
        mapZoomLevel,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        onCenterChanged: (centre) => {
            boundPositionActions.responsePosition(centre);
        },
        fetchPosition: () => {
            boundPositionActions.fetchPosition();
            GA.event({
                category: 'Location',
                action: 'Locate Me'
            });
        },
        updateTime: (date) => {
            boundPositionActions.updateTime(date)
        },
        setCurrentPub: (foursquareID) => {
            boundPositionActions.setCurrentPub(foursquareID);
        },
        shouldSuggest: (bool) => {
            boundPositionActions.shouldSuggest(bool);
        },
        mapZoomFocus: () => {
            boundPositionActions.mapZoomFocus();
        },
        onZoomChanged: (zoomLevel) => {
            boundPositionActions.changeZoom(zoomLevel)
        }
    }
}

const LocateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Locate)

export default LocateContainer;
