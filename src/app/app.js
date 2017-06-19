import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, hashHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux'
import createDebounce from 'redux-debounced'
import { saveState, loadState} from './services/localStorage';

import reducers from './reducers';

import Start from './screens/start/start_container';
import PubDetail from './screens/pubdetail/pubdetail_container';
import Locate from './screens/locate/locate_container';
import Base from './screens/base/base_container';
import Add from './screens/addpub/addpub_container';
import Admin from './screens/admin/admin_container';
import NoMatch from './screens/nomatch';
import FatalError from './screens/error';


import GA from 'react-ga';

//fetch / promise polyfill
import promise from 'es6-promise';
import 'isomorphic-fetch';
promise.polyfill();

const createStoreWithMiddleware = applyMiddleware(
    createDebounce(),
    thunkMiddleware,
    routerMiddleware(hashHistory),
)(createStore);

const persistedState = loadState();

const store = createStoreWithMiddleware(
    reducers,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe( () => {
    saveState({
        recommend: store.getState().recommend
    });
})

if(window.location.hostname.indexOf('pintsinthesun.co.uk') != -1){
    GA.initialize('UA-15712565-30');
}

function logPageView(){
    GA.pageview(window.location.hash.split('?')[0].replace('#', ''));
}

ReactDOM.render((
    <Provider store={store}>
        <div>
            <Router onUpdate={logPageView} className="AppContainer" history={hashHistory}>
                <Route path="/" component={Base}>
                    <IndexRoute component={Start} />
                    <Route path="/pubs(/:suggest)" component={Locate} />
                    <Route path="/add" component={Add} />
                    <Route path="/error" component={FatalError} />
                    <Route path="/admin" component={Admin} />
                    <Route path="*" component={NoMatch}/>
                </Route>
            </Router>
        </div>
    </Provider>
), document.getElementById('App'));
