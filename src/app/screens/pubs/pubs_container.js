import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import Pubs from './pubs_component';


const mapStateToProps = (state, ownProps) => {
    const {
        date,
        items,
        filteredPubs,
        currentPub,
        filteredIndex
    } = state.position;

    return {
        date,
        items,
        filteredPubs,
        currentPub,
        filteredIndex
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        updateTime: date => {
            boundPositionActions.updateTime(date)
        },
        incrementCurrentPub: index => {
            boundPositionActions.incrementCurrentPub();
        }
    }
}

const PubsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Pubs)

export default PubsContainer;
