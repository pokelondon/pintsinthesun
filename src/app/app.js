import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, hashHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import createLogger from "redux-logger";

import reducers from './reducers';

import Start from './screens/start/start_container';
import Pubs from './screens/pubs/pubs_container';
import PubDetail from './screens/pubdetail/pubdetail_container';
import Locate from './screens/locate/locate_container';
import Base from './screens/base/base_container';
import AdminTool from './screens/admintool/admintool_component';
import NoMatch from './screens/nomatch';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    //loggerMiddleware
)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render((
    <Provider store={store}>
        <div>
            <Router className="AppContainer" history={hashHistory}>
                <Route path="/" component={Base}>
                    <IndexRoute component={Start} />
                    <Route path="/locate" component={Locate} />
                    <Route path="/pubs" component={Pubs}>
                        <Route path="/pubs/:index" component={PubDetail} />
                    </Route>
                    <Route path="/admin" component={AdminTool} />
                    <Route path="*" component={NoMatch}/>
                </Route>
            </Router>
        </div>
    </Provider>
), document.getElementById('App'));
