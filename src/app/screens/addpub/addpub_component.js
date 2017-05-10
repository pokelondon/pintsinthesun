import React from 'react';
import { searchPubs, getLocationData } from '../../services/googlemaps';
import { savePub, getPub } from '../../services/pintsinthesun';
import StaticMap from '../../components/static-map';
import PubSearch from '../../components/PubSearch';
import LocationDetails from '../../components/admin/LocationDetails';
import PubSuggestionConfirm from '../../components/PubSuggestionConfirm';
import hashHistory from 'react-router'
import classNames from 'classNames';
import config from '../../config';
import { testIsPub } from '../../utils/pintsUtils';

const DEFAULT_STATE = {
    placeID: null,
    locationData: null,
    hasOutsideSpace: false,
    hasGarden: false,
    isSaved: false,
    hasError: false
}

export default class AddPubComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ...DEFAULT_STATE,
            locationLat: this.props.centre.lat,
            locationLng: this.props.centre.lng,
        }

        this.onLocationDetailsChange = this.onLocationDetailsChange.bind(this);
        this.savePub = this.savePub.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    /**
    * set the state back to default
    */

    resetForm() {
        this.setState(DEFAULT_STATE);
    }

    /**
     * Persist data through the service to the API
     */
    savePub(e) {
        e.preventDefault();
        savePub(this.state.placeID, this.state)
        .then(
            () => {
                this.setState({isSaved: true});
            },
            (err) => {
                this.setState({hasError: true});
            }
        );
    }


    /**
    * Focus on a new location once its selected from the search results or map
    * @param {string} placeID - the google place_id of the location to focus on
    * @return null
    */
    focusOnLocation(placeID) {

        if(!placeID){
            return;
        }

        //check if its in the DB already
        getPub(placeID).then((response) => {
            return response.json();
        }).then((data) => {
            //its not - find out more about the place and the focus the map on it
            if(!data.pub){
                getLocationData(placeID, this.googleMapRef, (result) => {
                    this.setState({
                        locationLat: result.geometry.location.lat(),
                        locationLng: result.geometry.location.lng(),
                        placeID: placeID,
                        locationData: result,
                        locationIsPub: testIsPub(result.types),
                        searchResults: null,
                        textFieldIsFocussed: null
                    });
                });
            } else {
                //exists in the database already
                if(data.pub.rejected){
                    this.props.showDialog('That pub has already been suggested, but we didn\'t think it was sunny enough&hellip;');
                } else {
                    this.props.showDialog('Thanks, but that pub has already been suggested!');
                }
            }
        })
    }


    /**
    * Handle change of location details form
    */
    onLocationDetailsChange(e) {
        const checkBox = e.target;
        let newState = {...this.state};
        newState[checkBox.name] = checkBox.checked;
        this.setState(newState);
    }


    /**
    * React render method
    */
    render(){

        return (
            <div className="Screen Add">

                <header className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Recommend a pub in the sun</p>
                        {/*
                            Search component composes its header component, because
                            divs need to be siblings in order for styling to not break
                        */}
                        <PubSearch
                            getMapRef={() => this.mapRef}
                            focusOnLocation={this.focusOnLocation.bind(this)}
                        >
                            <div className="Box Box-row">
                                <div className="Box Box-item">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus tincidunt ipsum eu venenatis. Sed consequat in mi vitae elementum.</p>
                                </div>
                            </div>
                        </PubSearch>
                    </div>
                </header>

                <div className="Screen-main max-width">
                    {this.state.locationData && this.state.locationIsPub &&
                        <div className="LocationDetailsWrapper">
                            <div className="LocationDetailsWrapper-floatingContainer">
                                {this.state.isSaved ||
                                    <LocationDetails
                                        name={this.state.locationData.name}
                                        hasOutsideSpace={this.state.hasOutsideSpace}
                                        hasGarden={this.state.hasGarden}
                                        onFormChange={this.onLocationDetailsChange}
                                        onSave={this.savePub}
                                    />
                                }
                                {this.state.isSaved &&
                                    <PubSuggestionConfirm
                                        onAddAnother={this.resetForm}
                                        onCancel={this.resetForm}
                                    />
                                }
                            </div>
                        </div>
                    }
                    <div className="Box Box-row">
                        <div className="Box Box-item Box-item--noPadding">
                            <StaticMap
                                offsetPin
                                centre={{
                                    lat: this.state.locationLat,
                                    lng: this.state.locationLng
                                }}
                                setMapRef={(ref) => {
                                    this.mapRef = ref;
                                }}
                                controllable={true}
                                onPlaceClick={this.focusOnLocation.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

