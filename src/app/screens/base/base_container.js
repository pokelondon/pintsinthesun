import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as uiActions from '../../actions/ui';

import Base from './base_component';


const mapStateToProps = (state, ownProps) => {
    const { date, isLocating, centre } = state.position;
    const { dialogVisible, dialogMessage, modal } = state.ui;

    return {
        isLocating,
        date,
        centre,
        modal,
        dialogVisible,
        dialogMessage,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        fetchPosition: () => {
            boundPositionActions.fetchPosition();
        },
        launchLocationModal: () => {
            boundPositionActions.launchLocationModal();
        },
        launchInfoModal: () => {
            dispatch(uiActions.launchInfoModal());
        },
        closeModal: () => {
            dispatch(uiActions.closeModal());
        },
        closeDialog: () => {
            dispatch(uiActions.closeDialog());
        }
    }
}

const BaseContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Base)

export default BaseContainer;
