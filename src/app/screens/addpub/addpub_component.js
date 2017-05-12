import React from 'react';
import { searchPubs, getLocationData } from '../../services/googlemaps';
import { savePub, getPub } from '../../services/pintsinthesun';
import StaticMap from '../../components/static-map';
import PubSearchContainer from '../../components/PubSearch/PubSearchContainer';
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
    }

    componentWillUnmount() {
        this.props.resetForm();
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
                        <PubSearchContainer
                            getMapRef={() => this.mapRef}
                        >
                            <div className="Box Box-row">
                                <div className="Box Box-item">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean faucibus tincidunt ipsum eu venenatis. Sed consequat in mi vitae elementum.</p>
                                </div>
                            </div>
                        </PubSearchContainer>
                    </div>
                </header>

                <div className="Screen-main max-width">
                    {this.props.placeID && this.props.locationIsPub &&
                        <div className="LocationDetailsWrapper">
                            <div className="LocationDetailsWrapper-floatingContainer">
                                {this.props.isSaved ||
                                    <LocationDetails
                                        name={this.props.placeName}
                                        hasOutsideSpace={this.props.hasOutsideSpace}
                                        hasGarden={this.props.hasGarden}
                                        onFormChange={this.props.onLocationDetailsChange}
                                        onSave={this.props.savePub}
                                    />
                                }
                                {this.props.isSaved &&
                                    <PubSuggestionConfirm
                                        onAddAnother={this.props.resetForm}
                                        onCancel={this.props.resetForm}
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
                                    lat: this.props.centre.lat,
                                    lng: this.props.centre.lng
                                }}
                                setMapRef={(ref) => {
                                    this.mapRef = ref;
                                }}
                                controllable={true}
                                onPlaceClick={this.props.focusOnLocation}
                                onCenterChanged={this.props.onCenterChanged}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

