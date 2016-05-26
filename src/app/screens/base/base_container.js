import { connect } from 'react-redux'

import Base from './base_component';


const mapStateToProps = (state, ownProps) => {
    const { date, isLocating } = state.position;

    return {
        isLocating,
        date
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const BaseContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Base)

export default BaseContainer;
