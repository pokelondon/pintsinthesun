import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as locateActions from '../../actions/locate';

import Locate from './locate_component';


const mapStateToProps = (state, ownProps) => {
    const { centre } = state.position;
    const { angle } = state.locate;
    return {
        centre,
        angle
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);
    const boundLocateActions = bindActionCreators(locateActions, dispatch);

    return {
        /**
         * [SIC]
         */
        onCenterChanged: (centre) => {
            boundPositionActions.responsePosition(centre);
        },
        fetchPosition: () => {

        },
    }
}

const LocateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Locate)

export default LocateContainer;


