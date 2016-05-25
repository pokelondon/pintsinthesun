import { combineReducers } from 'redux';

import position from './position';
import data from './data';
import locate from './locate';


export default combineReducers({
    position,
    data,
    locate
});
