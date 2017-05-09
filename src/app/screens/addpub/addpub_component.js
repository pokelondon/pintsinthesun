import React from 'react';
import { searchPubs, getLocationData } from '../../services/googlemaps';
import { getPub } from '../../services/pintsinthesun';
import StaticMap from '../../components/static-map';
import PubSearch from '../../components/PubSearch';
import hashHistory from 'react-router'
import classNames from 'classNames';
import config from '../../config';
import { testIsPub } from '../../utils/pintsUtils';

export default class AddPubComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            placeID: null,
            locationLat: this.props.centre.lat,
            locationLng: this.props.centre.lng,
            locationData: null,
        }
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
    * Get the JSX needed to create the pub detail card
    * @return {jsx} the markup
    */
    getPubDetails() {
        if(this.state.locationData && this.state.locationIsPub){
            return (
                <div>
                    <div className="Box Box-row">
                        <div className="Box Box-item">
                            <h2 className="Heading--2">{this.state.locationData.name}</h2>
                            <p>{this.state.locationData.formatted_address}</p>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box Box-item Box-item--noPadding">
                            <button onClick={this.props.addPub.bind(this, this.state.locationData)} className="Button--secondary">Add this pub</button>
                        </div>
                    </div>
                </div>
            )
        }
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
                    <div className="Box Box-row">
                        <div className="Box Box-item Box-item--noPadding">
                            <StaticMap
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
                    {this.getPubDetails()}
                </div>
            </div>
        )

    }

}

