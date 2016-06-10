import React, { Component, PropTypes } from 'react';
import Map from '../../components/admin/map';
import LocationDetails from '../../components/admin/location-details';
import {getPubs} from '../../services/foursquare';
import AngleMarker from '../../components/admin/AngleMarker';
import {existsInLocalStorage} from '../../services/local';
import {savePub, checkPubsExist} from '../../services/pintsinthesun';
import {getDistance} from '../../utils/Geo';


export default class AdminTool extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            locations: [],
            currentLocation: null,
            currentAngle: 0,
            currentHasTerrace: false,
            currentBuildingToWest: false,
            currentIsSaved: false,
            centre: {lat: 51.523777, lng: -0.0781597}
        };

    }


    componentDidMount() {
        this.onMapCentreChanged(this.state.centre);
    }


    render() {

        let locationDetails, angleMarker, slider;

        if(this.state.currentLocation){

            let angle = this.state.currentLocation.outsideAngle || this.state.currentAngle;

            locationDetails = <LocationDetails
                location={this.state.currentLocation}
                hasTerrace={this.state.currentHasTerrace}
                buildingToTheWest={this.state.currentBuildingToWest}
                isSaved={this.state.currentIsSaved}
                onSave={this.saveLocation.bind(this)}
                angle={angle}
                onLocationSave={this.onLocationSave.bind(this)}
                onFormChange={this.onFormChange.bind(this)}
                onNextLocation={this.onNextLocation.bind(this)}
            />;

            angleMarker = <AngleMarker
                angle={angle}
                onAngleChage={this.onAngleChange.bind(this)}
            />;

        } else {
            locationDetails = <LocationDetails location={{name: ''}}/>
        }

        return (

            <div className="Screen">

                <header className="Screen-header">
                    <div className="max-width">
                        <h2>Add a pub</h2>
                        <div class="Box Box-row">
                            {locationDetails}
                        </div>
                    </div>
                </header>

                <div className="Screen-main max-width">
                    <div className="Box Box-row no-padding">
                        <div className="Map Box Box-item no-padding">
                            <Map
                                onCenterChanged={this.onMapCentreChanged.bind(this)}
                                onLocationSelect={this.onLocationSelect.bind(this)}
                                centre={this.state.centre}
                                locations={this.state.locations}
                                ref="Map"
                            />
                            {angleMarker}
                        </div>
                    </div>
                </div>

            </div>
        )
    }


    /**
     * Nullify some of the state so that the map shows no focussed location
     *
     */
    resetMap() {
        this.setState({
            currentLocation: null,
            currentHasTerrace: false,
            currentBuildingToWest: false,
            currentIsSaved: false,
            currentAngle: 0
        });
    }


    /**
     * Load pub list when the map has been dragged
     *
     */
    onMapCentreChanged(centre) {

        //If we are focussed on a location, and move the map more than 100m away,
        //unfocus from it
        if(this.state.currentLocation){
            let changedDistance = getDistance(
                this.state.currentLocation.location.lat,
                this.state.currentLocation.location.lng,
                centre.lat,
                centre.lng,
                'K'
            );
            if(changedDistance > 0.1){
                this.resetMap();
            }
        }

        this.setState({centre: centre});


        /* Get pubs near here from foursquare */
        //TODO - flatten these promises!
        getPubs(centre).then((response) => {

            let locations = response.map( (location, index) => {
                location.index = index;
                location.outdoorAngle = 0;
                return location;
            });
            return locations;

        }).then((FSQLocations) => {

            /* See if the pubs from foursquare already exist in the DB */
            let IDsToTest = FSQLocations.map(function(o) { return o.id; });
            checkPubsExist(IDsToTest).then( (DBLocations) => {
                this.updateLocationData(FSQLocations, DBLocations)
            });
        });
    }


    /**
     * Once we have data from foursquare, and data from the DB, merge them
     * here into one array, and then set that as the state.
     * @param {Array} FSQLocations
     * @param {Array} DBLocations
     */
    updateLocationData(FSQLocations, DBLocations) {

        FSQLocations.forEach( (FSQLocation) => {
            DBLocations.map( (DBLocation) => {
                if(DBLocation.foursquare.id === FSQLocation.id){
                    FSQLocation.exists = true;
                    FSQLocation.hasTerrace = DBLocation.has_terrace;
                    FSQLocation.buildingToTheWest = DBLocation.building_to_the_west;
                    FSQLocation.outdoorAngle = DBLocation.outdoor_angle;
                }
            });

        });

        this.setState({locations: FSQLocations});
        this.onLocationSelect(FSQLocations[0]);  //select the first one by default
    }

    /**
     * Set the state to focus on a particular location object
     *
     * @param {Object} locationObj
     */
    onLocationSelect(locationObj) {

        this.setState({
            currentLocation: locationObj,
            centre: locationObj.location,
            currentHasTerrace: locationObj.hasTerrace,
            currentBuildingToWest: locationObj.buildingToTheWest,
            currentAngle: locationObj.outdoorAngle,
            currentIsSaved: locationObj.exists
        });
    }


    onAngleChange(angle) {
        this.setState({currentAngle: angle});
    }


    /**
     * Force the map to re-render on save (an object in the locations array has changed
     * and react wont be aware of that)
     *
     */
    onLocationSave() {
        this.setState({currentIsSaved: true});
        this.forceUpdate();
    }


    /**
     *
     * Handle events of controlled form fields
     */
    onFormChange(e) {
        if(e.target.name === 'has_terrace'){
            this.setState({currentHasTerrace: e.target.checked});
        }
        if(e.target.name === 'building_to_the_west'){
            this.setState({currentBuildingToWest: e.target.checked});
        }
    }


    /**
     * Move the current selected location index to the next one
     *
     */
    onNextLocation() {
        let nextIndex = this.state.currentLocation.index + 1;
        if(nextIndex === this.state.locations.length -1){
            nextIndex = 0;
        }
        let nextLocation = this.state.locations[this.state.currentLocation.index + 1];
        this.onLocationSelect(nextLocation);

    }


    /**
     * Persist data through the service to the API
     * Also modify our local object optimisitically to reflect these changes
     *
     */
    saveLocation() {

        savePub(
            this.state.currentLocation.id,
            this.state.currentHasTerrace,
            this.state.currentBuildingToWest,
            this.state.currentAngle
        );

        this.state.currentLocation.exists = true;

        //save into local copy of this location
        this.state.currentLocation.hasTerrace = this.state.currentHasTerrace;
        this.state.currentLocation.buildingToTheWest = this.state.currentBuildingToWest;
        this.state.currentLocation.outdoorAngle = this.state.currentAngle;
        this.onLocationSave();
    }

}
