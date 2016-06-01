import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import PubDetail from './pubdetail_component';


const mapStateToProps = (state, ownProps) => {
    const {
        date,
        items,
        isFetching,
        isLocating,
        currentPub,
    } = state.position;

    return {
        date,
        items,
        isFetching,
        isLocating,
        pub: items[currentPub]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
    }
}

const PubDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PubDetail)

export default PubDetailContainer;

