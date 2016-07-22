import React, { Component, PropTypes } from 'react';
import {login} from '../../services/pintsinthesun';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/user';

class Login extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {loginError: false};
    }

    doLogin(e) {
        e.preventDefault();
        login(this.state.username, this.state.password).then( (result) => {
            if(result.status == 200){
                this.props.authUser(true);
                hashHistory.push('/admin');
            } else {
                this.setState({loginError: true});
            }
        });
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        let errorMsg;
        if(this.state.loginError) {
            errorMsg =  <div className="Box Box-row">
                            <div className="Box-item">Sorry, cant login</div>
                        </div>;
        }
        return (

            <div className="Screen-header">
                <div className="max-width">
                    <p className="Heading--1">Log in</p>
                    <form onSubmit={this.doLogin.bind(this)}>
                        <div className="Box Box-row">
                            <input className="Box-item" placeholder="Username" onChange={this.onUsernameChange.bind(this)} type="text" name="username" id="username" />
                            <input className="Box-item" placeholder="Password" onChange={this.onPasswordChange.bind(this)} type="password" name="password" id="password" />
                        </div>
                        {errorMsg}
                        <div className="Box Box-row">
                            <div className="Box-item Box-item--noPadding">
                                <button className="Button--secondary" type="submit">Log in</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        )
    }

}


const mapStateToProps = (state, ownProps) => {
    const { isAuthed } = state.user;

    return {
        isAuthed
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundUserActions = bindActionCreators(userActions, dispatch);

    return {
        authUser: () => {
            boundUserActions.authUser();
        }
    }
}

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)

export default LoginContainer;