import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, hashHistory } from 'react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import createLogger from "redux-logger";

import reducers from './reducers';

import Start from './screens/start/start_container';
import Pubs from './screens/pubs/pubs_container';
import Locate from './screens/locate';
import NoMatch from './screens/nomatch';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)(createStore);
const store = createStoreWithMiddleware(reducers);


ReactDOM.render((
    <Provider store={store}>
        <Router className="AppContainer" history={hashHistory}>
            <Route path="/" component={Start} />
            <Route path="/pubs/:lat/:lng" component={Pubs} />
            <Route path="/locate" component={Locate} />
            <Route path="*" component={NoMatch}/>
        </Router>
    </Provider>
), document.getElementById('App'));
