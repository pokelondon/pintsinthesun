import { combineReducers } from 'redux';

import position from './position';
import data from './data';


export default combineReducers({
    position,
    data
});
