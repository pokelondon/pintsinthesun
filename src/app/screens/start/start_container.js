import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as dataActions from '../../actions/data';

import Start from './start_component';


const mapStateToProps = (state, ownProps) => {
    const { centre, date } = state.position;

    return {
        centre,
        date
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);
    const boundDataActions = bindActionCreators(dataActions, dispatch);

    return {
        fetchPosition: () => {
            boundPositionActions.fetchPosition();
        },
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
