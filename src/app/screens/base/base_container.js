import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import Base from './base_component';


const mapStateToProps = (state, ownProps) => {
    const { date, isLocating, centre, modal } = state.position;

    return {
        isLocating,
        date,
        centre,
        modal
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
            boundPositionActions.launchInfoModal();
        },
        closeModal: () => {
            boundPositionActions.closeModal();
        }
    }
}

const BaseContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Base)

export default BaseContainer;
