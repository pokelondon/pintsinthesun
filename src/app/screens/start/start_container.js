import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'

import * as positionActions from '../../actions/position';

import Start from './start_component';


const mapStateToProps = (state, ownProps) => {
    const { date } = state.position;

    return {
        date
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        setMorning: () => {
            let date = new Date();
            date.setHours(10);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));
        },
        setAfternoon: () => {
            let date = new Date();
            date.setHours(13);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));
        },
        setEvening: () => {
            let date = new Date();
            date.setHours(18);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));
        },
    }
}

const StartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Start)



export default StartContainer;
