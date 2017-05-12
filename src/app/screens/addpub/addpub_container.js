import React from 'react';
import { connect } from 'react-redux'
import AddPubComponent from './addpub_component';
import * as positionActions from '../../actions/position';
import * as addPubActions from '../../actions/addPub';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => {
    const { centre } = state.position;
    const { placeID, placeName, locationIsPub, hasOutsideSpace, hasGarden, isSaved, hasError } = state.addPub;
    return {
        centre,
        placeID,
        placeName,
        locationIsPub,
        hasOutsideSpace,
        hasGarden,
        isSaved,
        hasError,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundActions = bindActionCreators(positionActions, dispatch);
    return {
        addPub: (pubDetails) => {
            boundActions.addPub(pubDetails);
            hashHistory.push('/confirm');
        },
        showDialog: (message) => {
            boundActions.showDialog(message);
        },
        onLocationDetailsChange: (e) => {
            const checkBox = e.target;
            dispatch(addPubActions.changePubDetail(checkBox.name, checkBox.checked));
        },
        savePub: () => {
            dispatch(addPubActions.savePub());
        },
        resetForm: () => {
            dispatch(addPubActions.resetForm());
        },
        focusOnLocation: (placeID) => {
            dispatch(addPubActions.focusOnLocation(placeID));
        },
        onCenterChanged: (centre) => {
            console.log('drag end, centre = ', centre);
            dispatch(positionActions.responsePosition(centre));
        }

    }
}

export default connect( mapStateToProps, mapDispatchToProps )(AddPubComponent);