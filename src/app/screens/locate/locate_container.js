import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as locateActions from '../../actions/locate';

import Locate from './locate_component';


const mapStateToProps = (state, ownProps) => {
    const { centre, sun, items, filteredPubs, date, isLocating } = state.position;
    const { angle } = state.locate;
    return {
        date,
        sun,
        centre,
        angle,
        items,
        filteredPubs,
        isLocating
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
        }
    }
}

const LocateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Locate)

export default LocateContainer;


