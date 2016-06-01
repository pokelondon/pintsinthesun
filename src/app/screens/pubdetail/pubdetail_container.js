import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import PubDetail from './pubdetail_component';


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
    return {
    }
}

const PubDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PubDetail)

export default PubDetailContainer;

