import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as dataActions from '../../actions/data';

import Pubs from './pubs_component';


const mapStateToProps = (state, ownProps) => {
    const { centre, date } = state.position;
    const { items, receivedAt, isFetching } = state.data;
    return {
        centre,
        date,
        items,
        receivedAt,
        isFetching
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);
    const boundDataActions = bindActionCreators(dataActions, dispatch);

    return {
        fetchPubs: (date, centre) => {
            boundDataActions.fetchPubs(date, centre);
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

