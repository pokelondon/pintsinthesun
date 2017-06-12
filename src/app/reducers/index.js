import { combineReducers } from 'redux';

import position from './position';
import locate from './locate';
import weather from './weather';
import addPub from './addPub';
import ui from './ui';
import recommend from './recommend';
import geocode from './geocode';
import pubNameSearch from './pubNameSearch';


export default combineReducers({
    weather,
    position,
    locate,
    addPub,
    ui,
    recommend,
    geocode,
    pubNameSearch
});
