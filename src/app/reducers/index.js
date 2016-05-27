import { combineReducers } from 'redux';

import position from './position';
import locate from './locate';


export default combineReducers({
    position,
    locate
});
