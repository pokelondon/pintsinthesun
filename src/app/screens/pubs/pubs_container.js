import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import Pubs from './pubs_component';


const mapStateToProps = (state, ownProps) => {
    const {
        centre,
        date,
        sun,
        items,
        receivedAt,
        isFetching,
        filteredPubs
    } = state.position;

    return {
        centre,
        date,
        sun,
        items,
        receivedAt,
        isFetching,
        filteredPubs
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        fetchPubs: (date, centre) => {
            boundPositionActions.fetchPubs(date, centre);
        },
        filterPubs: () => {
            // Might not need
            boundPositionActions.filterPubs();
        },
        updateTime: (date) => {
            boundPositionActions.updateTime(date)
        }
    }
}

const PubsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Pubs)

export default PubsContainer;

