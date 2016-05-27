import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';
import * as dataActions from '../../actions/data';

import PubDetail from './pubdetail_component';


const mapStateToProps = (state, ownProps) => {
    const { centre, date, sun } = state.position;
    const { items, receivedAt, isFetching } = state.data;
    return {
        date,
        items,
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

