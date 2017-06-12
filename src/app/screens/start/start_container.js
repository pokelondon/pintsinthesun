import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'
import GA from 'react-ga';

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
        setNow: () => {
            let date = new Date();
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs/suggest'));

            GA.event({
                category: 'Filter',
                action: 'Set Time Range',
                label: 'Now'
            });
        },
        setMorning: () => {
            let date = new Date();
            date.setHours(10);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));

            GA.event({
                category: 'Filter',
                action: 'Set Time Range',
                label: 'Morning'
            });
        },
        setAfternoon: () => {
            let date = new Date();
            date.setHours(13);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));

            GA.event({
                category: 'Filter',
                action: 'Set Time Range',
                label: 'Afternoon'
            });
        },
        setEvening: () => {
            let date = new Date();
            date.setHours(18);
            boundPositionActions.updateTime(date);
            dispatch(push('/pubs'));

            GA.event({
                category: 'Filter',
                action: 'Set Time Range',
                label: 'Evening'
            });
        },
    }
}

const StartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Start)



export default StartContainer;
