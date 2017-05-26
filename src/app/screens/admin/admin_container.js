import React from 'react';
import { connect } from 'react-redux'
import AdminComponent from './admin_component';
import * as uiActions from '../../actions/ui';

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        showDialog: (message) => {
            dispatch(uiActions.showDialog(message));
        }
    }
}

export default connect(null, mapDispatchToProps)(AdminComponent);