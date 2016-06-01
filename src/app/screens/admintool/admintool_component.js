import React, { Component, PropTypes } from 'react';
import Map from '../../components/admin/map';
import LocationDetails from '../../components/admin/location-details';
import {getPubs} from '../../services/foursquare';
import AngleMarker from '../../components/admin/AngleMarker';
import {existsInLocalStorage} from '../../services/local';
import {savePub} from '../../services/pintsinthesun';
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

        }

        return (

            <div>
                <div style={{height: 600, width: 600, position: 'relative'}}>
                    <Map
                        onCenterChanged={this.onMapCentreChanged.bind(this)}
                        onLocationSelect={this.onLocationSelect.bind(this)}
                        centre={this.state.centre}
                        locations={this.state.locations}
                        ref="Map"
                    />
                    {angleMarker}
                </div>

                <div className="col-xs-10 col-xs-offset-4">
                    {locationDetails}
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
            currentAngle: 0
        });
    }


    /**
     * Load pub list when the map has been dragged
     *
     */
    onMapCentreChanged(centre) {

        //If we are focussed on a location, and move the map more than 30m away,
        //unfocus from it
        if(this.state.currentLocation){
            let changedDistance = getDistance(
                this.state.currentLocation.location.lat,
                this.state.currentLocation.location.lng,
                centre.lat,
                centre.lng,
                'K'
            );
            if(changedDistance > 0.03){
                this.resetMap();
            }
        }

        this.setState({centre: centre});

        getPubs(centre).then((response) => {
            let locations = response.map( (location, index) => {

                //save the index internally in the location so we can later find
                //the next index (sort of link a linked list, but not)
                location.index = index;

                //mock this data as we know it wont exist (it might if data comes
                //from the db instead of FSQ)
                location.exists = existsInLocalStorage(location.id);
                location.hasTerrace = false;
                location.buildingToTheWest = false;
                location.outdoorAngle = 0;
                return location;
            });
            this.setState({locations: locations});
        });

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
            currentAngle: locationObj.outdoorAngle
        });
    }


    onAngleChange(angle) {
        this.setState({currentAngle: angle});
    }


    /**
     * Force the map to re-render (an object in the locations array has changed
     * and react wont be aware of that)
     *
     */
    onLocationSave() {
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
        this.onLocationSelect(nextLocation)

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
