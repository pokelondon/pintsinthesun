import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, hashHistory } from 'react-router'

import Start from './screens/start';
import Pubs from './screens/pubs';
import Locate from './screens/locate';
import NoMatch from './screens/nomatch';


ReactDOM.render((
    <Router className="AppContainer" history={hashHistory}>
        <Route path="/" component={Start} />
        <Route path="/pubs/:lat/:lng" component={Pubs} />
        <Route path="/locate" component={Locate} />
        <Route path="*" component={NoMatch}/>
    </Router>
), document.getElementById('App'));
