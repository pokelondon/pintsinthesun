import React from 'react';
import { connect } from 'react-redux'
import AdminComponent from './admin_component';
import * as positionActions from '../../actions/position';
import { bindActionCreators } from 'redux';

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundActions = bindActionCreators(positionActions, dispatch);
    return {
        showDialog: (message) => {
            boundActions.showDialog(message);
        }
    }
}

export default connect( null, mapDispatchToProps )(AdminComponent);