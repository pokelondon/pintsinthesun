import React from 'react';
import { connect } from 'react-redux'
import AdminToolComponent from './admintool_component';
import * as positionActions from '../../actions/position';
import { bindActionCreators } from 'redux';


const mapStateToProps = (state, ownProps) => {
    const { pubToAdd, centre } = state.position;
    return {
        pubToAdd,
        centre
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect( mapStateToProps, mapDispatchToProps )(AdminToolComponent);