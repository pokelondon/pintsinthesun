import React from 'react';
import { connect } from 'react-redux'
import AddPubComponent from './addpub_component';
import * as positionActions from '../../actions/position';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

const mapStateToProps = (state, ownProps) => {
    const { centre } = state.position;
    return {
        centre
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundActions = bindActionCreators(positionActions, dispatch);
    return {
        addPub: (pubDetails) => {
            hashHistory.push('/admin');
            boundActions.addPub(pubDetails);
        },
        showDialog: (message) => {
            boundActions.showDialog(message);
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(AddPubComponent);