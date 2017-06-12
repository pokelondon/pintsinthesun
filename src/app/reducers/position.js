import SunCalc from '../lib/suncalc';
import _ from 'lodash';

import {
    UPDATE_TIME,
    FETCH_POSITION,
    REQUEST_POSITION,
    RESPONSE_POSITION,
    REQUEST_PUBS,
    RESPONSE_PUBS,
    REQUEST_PUB_DETAIL,
    RESPONSE_PUB_DETAIL,
    RESPONSE_ADDRESS,
    REQUEST_ADDRESS,
    ADD_PUB,
    SET_POSITION,
    SET_CURRENT_PUB,
    SHOULD_SUGGEST,
    SUGGEST_PUB,
} from '../actions/position';

import { GEOCODE_SUCCESS } from '../actions/geocode';

import { RECOMMEND_PUB_SUCCESS } from '../actions/recommend';

const date = new Date();
const ANGLE_RANGE = 90;
const centre = {lat: 51.54, lng: -0.04};

function getAngleRange(position) {
    var sunAngle = position.azimuth * 180 / Math.PI;
    return [sunAngle - 90 - (ANGLE_RANGE/2), sunAngle - 90 + (ANGLE_RANGE/2)];
}

function filterForAngle(sun, items) {
    //TODO - clean this up - no longer filtering for time
    return items;
    // let [ min, max ] = getAngleRange(sun);
    // const res = items.filter(item => (item.outdoor_angle >= min && item.outdoor_angle <= max));
    // return res;
}

/**
* Convert Mongo style lat/lng format (backwards array) to a more useful {lat, lng} format
* @param {array} arr - the mongo style location array
* @return {object} - the position in the form {lat, lng}
*/
function normaliseLatLng(arr) {
    return {lat: arr[1], lng: arr[0]};
}

const INITIAL_STATE = {
    isLocating: false,
    sun: getAngleRange(SunCalc.getPosition(date, centre.lat, centre.lng)),
    centre,
    date,
    items: [],
    filteredPubs : [],
    isFetching: false,
    currentPub: 0,
    modal: null,
    timeRange: 'now',
    locationHasBeenRequested: false,
    shouldSuggest: false,
}

export default function position(state=INITIAL_STATE, action) {
    switch (action.type) {
        case SHOULD_SUGGEST:
            return {
                ...state,
                shouldSuggest: action.payload
            }
        case GEOCODE_SUCCESS:
            return {
                ...state,
                centre: action.payload
            }
        case ADD_PUB:
            return {
                ...state,
                pubToAdd: action.pubDetails
            }
        case REQUEST_ADDRESS:
            return {
                ...state,
                address: ''
            }
        case RESPONSE_ADDRESS:
            return {
                ...state,
                address: action.address
            }
        case UPDATE_TIME:
            var sun = SunCalc.getPosition(action.date, state.centre.lat, state.centre.lng);
            return {
                ...state,
                date: action.date,
                timeRange: action.timeRange,
                filteredPubs: filterForAngle(sun, state.items),
                sun
            }
        case RESPONSE_POSITION:

            var sun = SunCalc.getPosition(state.date, action.centre.lat, action.centre.lng);
            return {
                ...state,
                centre: action.centre,
                isLocating: false,
                filteredPubs: filterForAngle(sun, state.items),
                isRealPosition: action.isRealPosition,
                isGPSPosition: action.isGPSPosition,
                address: action.address,
                sun
            }
        case REQUEST_POSITION:
            return {
                ...state,
                locationHasBeenRequested: true,
                isLocating: true
            }
        case REQUEST_PUBS:
            return {
                ...state,
                isFetching: true
            }
        case REQUEST_PUB_DETAIL:
            return {
                ...state,
                isFetching: true
            }
        case RESPONSE_PUBS:
            return {
                ...state,
                isFetching: false,
                items: action.items,
                //order filtered pubs by distance
                filteredPubs: filterForAngle(state.sun, action.items).sort((a, b) => {
                    return a.distance > b.distance ? 1 : -1;
                }),
                currentPub: 0
            }
        case RESPONSE_PUB_DETAIL:
            return {
                ...state,
                isFetching: false,
                pub: action.pub
            }
        case SHOULD_SUGGEST:
            return {
                ...state,
                shouldSuggest: action.payload
            }
        case SUGGEST_PUB: {
            //pick first pub that is recommended
            const suggestedPub = _.find(state.filteredPubs, pub => pub.known);
            if(suggestedPub){
                return {
                    ...state,
                    shouldSuggest: false,
                    centre: normaliseLatLng(suggestedPub.location.coordinates),
                    pub: {...suggestedPub}
                }
            } else {
                return {
                    ...state,
                    shouldSuggest: false
                }
            }
        }
        //take a deep copy of the selecteded pub by index from the current list of pubs
        case SET_CURRENT_PUB: {
            const selectedPub = state.filteredPubs[action.index];
            return {
                ...state,
                pub: {...selectedPub},
                centre: normaliseLatLng(selectedPub.location.coordinates)
            }
        }
        case SET_POSITION:
            return {
                ...state,
                centre: action.centre
            }
        //Set pub to be recommended: true in the items list
        case RECOMMEND_PUB_SUCCESS:
            return {
                ...state,
                items: state.items.map((pub) => {
                    return (pub.foursquareID === action.foursquareID) ? {...pub, recommended: true} : {...pub};
                })
            }
        default:
            return state;
    }
}
