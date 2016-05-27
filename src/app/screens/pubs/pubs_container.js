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
        isFetching
    } = state.position;

    return {
        centre,
        date,
        sun,
        items,
        receivedAt,
        isFetching
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        fetchPubs: (date, centre) => {
            boundPositionActions.fetchPubs(date, centre);
        },
        filterPubs: () => {
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

