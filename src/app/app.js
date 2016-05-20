import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, hashHistory } from 'react-router'

import Start from './screens/start';
import Pubs from './screens/pubs';
import Pub from './screens/pub';
import NoMatch from './screens/nomatch';



ReactDOM.render((
    <Router className="AppContainer" history={hashHistory}>
        <Route path="/" component={Start} />
        <Route path="pubs" component={Pubs}>
            <Route path="/pubs/:pubId" component={Pub}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Router>
), document.getElementById('App'));
