import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import Start from './start_component';


const mapStateToProps = (state, ownProps) => {
    const { centre, date, isLocating } = state.position;

    return {
        isLocating,
        centre,
        date
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        updateTime: (date) => {
            boundPositionActions.updateTime(date);
        }
    }
}

const StartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Start)

export default StartContainer;
