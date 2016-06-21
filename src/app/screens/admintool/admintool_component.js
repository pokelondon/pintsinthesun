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
            outdoorAngle: 0,
            hasTerrace: false,
            buildingToTheWest: false,
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

            locationDetails = <LocationDetails
                {...this.state}
                location={this.state.currentLocation}
                isSaved={this.state.currentIsSaved}
                onSave={this.saveLocation.bind(this)}
                onLocationSave={this.onLocationSave.bind(this)}
                onFormChange={this.onFormChange.bind(this)}
                onNextLocation={this.onNextLocation.bind(this)}
            />;

            angleMarker = <AngleMarker
                angle={this.state.outdoorAngle}
                onAngleChage={this.onAngleChange.bind(this)}
            />;

        } else {
            locationDetails = <LocationDetails location={{name: ''}}/>
        }

        return (

            <div className="Screen Admin-tool">

                <header className="Screen-header">
                    <div className="max-width">
                        <h2>Add pubs</h2>
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
                    <div className="Box Box-row no-padding">
                        <div className="Box Box-item no-padding">
                            <button onClick={this.loadPubData.bind(this)} className="Button--primary">Load some pubs near here</button>
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
            hasTerrace: false,
            hasGarden: false,
            buildingToTheWest: false,
            isOnHill: false,
            isIsolated: false,
            isInPark: false,
            currentIsSaved: false,
            outdoorAngle: 0
        });
    }


    /**
     * Set the state when dragged. If theyve dragged more than 200m, reset the map
     *
     */
    onMapCentreChanged(centre) {
        this.setState({centre: centre});
        if(this.state.currentLocation){
            let distance = getDistance(centre.lat, centre.lng, this.state.currentLocation.location.lat, this.state.currentLocation.location.lng);
            if(distance > 0.20){
                this.resetMap();
            }
        }
    }



    /**
     * Load some locations from foursquare near the current centre
     *
     */
    loadPubData() {
        getPubs(this.state.centre).then((response) => {

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
                    //copy attributes from DB location data into the FSQ object
                    //TODO refactor this translation into the service, shouldnt be here
                    FSQLocation.exists = true;
                    FSQLocation.hasTerrace = DBLocation.has_terrace;
                    FSQLocation.hasGarden = DBLocation.has_garden;
                    FSQLocation.isIsolated = DBLocation.is_isolated;
                    FSQLocation.isOnHill = DBLocation.is_on_hill;
                    FSQLocation.isInPark = DBLocation.is_in_park;
                    FSQLocation.buildingToTheWest = DBLocation.building_to_the_west;
                    FSQLocation.outdoorAngle = DBLocation.outdoor_angle;
                }
            });

        });

        this.setState({locations: FSQLocations});
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
            hasTerrace: locationObj.hasTerrace,
            buildingToTheWest: locationObj.buildingToTheWest,
            outdoorAngle: locationObj.outdoorAngle,
            hasGarden: locationObj.hasGarden,
            isIsolated: locationObj.isIsolated,
            isOnHill: locationObj.isOnHill,
            isInPark: locationObj.isInPark,
            currentIsSaved: locationObj.exists
        });
    }


    onAngleChange(angle) {
        this.setState({outdoorAngle: angle});
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
        let checkBox = e.target;
        let tempState = Object.assign({}, this.state);
        tempState[checkBox.name] = checkBox.checked;
        this.setState(tempState);
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

        savePub(this.state.currentLocation.id, this.state)
        .then(
            function(){
                console.log('saved pub');
            },
            function(err){
                alert('error - pub not saved'); //TODO - handle this in UI properly
            }
        );

        this.state.currentLocation.exists = true;

        //save into local copy of this location
        //do this without Object.assign to avoid circular references
        this.state.currentLocation.hasTerrace = this.state.hasTerrace;
        this.state.currentLocation.hasGarden = this.state.hasGarden;
        this.state.currentLocation.isIsolated = this.state.isIsolated;
        this.state.currentLocation.isOnHill = this.state.isOnHill;
        this.state.currentLocation.isInPark = this.state.isInPark;
        this.state.currentLocation.buildingToTheWest = this.state.buildingToTheWest;
        this.state.currentLocation.outdoorAngle = this.state.outdoorAngle;

        this.onLocationSave();
    }

}
