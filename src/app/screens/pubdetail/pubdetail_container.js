import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import PubDetail from './pubdetail_component';

import GA from 'react-ga';

const mapStateToProps = (state, ownProps) => {
    const {
        date,
        items,
        isFetching,
        isLocating,
        currentPub,
        filteredPubs,
        filteredIndex
    } = state.position;

    return {
        date,
        items,
        isFetching,
        isLocating,
        filteredPubs,
        currentPub,
        filteredIndex,
        pub: items[currentPub]
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
            GA.event({
                category: 'Filter',
                action: 'Show Another'
            });
        },
        launchLocationModal: () => {
            boundPositionActions.launchLocationModal();
        }
    }
}

const PubDetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PubDetail)

export default PubDetailContainer;
