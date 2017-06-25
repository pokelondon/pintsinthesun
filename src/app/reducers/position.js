import SunCalc from '../lib/suncalc';
import _ from 'lodash';
import { getSuggestedPub, normaliseLatLng } from '../utils/pintsUtils';

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
    MAP_ZOOM_CHANGE,
    FOCUS_ON_PUB_LOCATION,
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


const INITIAL_STATE = {
    isLocating: false,
    sun: getAngleRange(SunCalc.getPosition(date, centre.lat, centre.lng)),
    centre,
    date,
    items: [],
    filteredPubs : {},
    suggestedPubIDs: [],
    isFetching: false,
    currentPub: 0,
    modal: null,
    timeRange: 'now',
    locationHasBeenRequested: false,
    shouldSuggest: false,
    mapZoomLevel: 15
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
                mapZoomLevel: 15,
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
                sun
            }
        case RESPONSE_POSITION:

            var sun = SunCalc.getPosition(state.date, action.centre.lat, action.centre.lng);
            return {
                ...state,
                centre: action.centre,
                isLocating: false,
                //filteredPubs: filterForAngle(sun, state.items),
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
        case RESPONSE_PUBS: {
            const fetchedPubsAsKeyedObj = _.keyBy(action.items, pub => pub.foursquareID);
            return {
                ...state,
                isFetching: false,
                filteredPubs: {...state.filteredPubs, ...fetchedPubsAsKeyedObj}
            }
        }
        case RESPONSE_PUB_DETAIL: {
            const newPubObj = {[action.pub.foursquareID]: action.pub};
            return {
                ...state,
                filteredPubs: {...state.filteredPubs, ...newPubObj}
            }
        }
        case SUGGEST_PUB:
            return {
                ...state,
                shouldSuggest: false
            }
        case SET_CURRENT_PUB: {
            return {
                ...state,
                currentPub: action.payload
            }
        }
        //move the map to point to the current selected pub
        case FOCUS_ON_PUB_LOCATION: {
            const selectedPub = state.filteredPubs[state.currentPub];
            if(selectedPub){
                return {
                    ...state,
                    centre: normaliseLatLng(selectedPub.location.coordinates),
                    mapZoomLevel: 17
                }
            }
            return state;
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
        case MAP_ZOOM_CHANGE:
            return {
                ...state,
                mapZoomLevel: action.payload
            }
        default:
            return state;
    }
}

export const getSelectedPubObj = (state) => {
    return state.filteredPubs[state.currentPub];
}
