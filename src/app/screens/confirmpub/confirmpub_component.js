import React, { Component, PropTypes } from 'react';
import Map from '../../components/admin/map';
import { getPubs } from '../../services/foursquare';
import AngleMarker from '../../components/admin/anglemarker';
import { existsInLocalStorage } from '../../services/local';
import { savePub, checkPubsExist } from '../../services/pintsinthesun';
import { getDistance } from '../../utils/Geo';
import { hashHistory, Link } from 'react-router';
import LocationDetails from '../../components/admin/location_details'


export default class AdminToolComponent extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            outdoorAngle: 0,
            hasGarden: false,
            hasOutsideSpace: false,
            isSaved: false,
            hasError: false
        };

    }

    /**
    * On mount, if there is no current pub to add in redux, redirect to the add view
    */
    componentDidMount() {
        if(!this.props.pubToAdd){
            hashHistory.push('/add');
        }
    }

    /**
    * Get markup for top panel
    * @return {JSX} the markup
    */
    getTopPanel() {
        if(this.state.isSaved){
            return (
                <form className="Location-details">
                    <div className="Box Box-row">
                        <div className="Box Box-item">
                            <h2 className="Heading--1">{this.props.pubToAdd.name}</h2>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box Box-item">
                            <p>Thanks for suggesting a sunny pub! Fancy <Link to="/add">suggesting another</Link>?</p>
                        </div>
                    </div>
                </form>
            )
        }
        if(this.state.hasError){
            return (
                <form className="Location-details">
                    <div className="Box Box-row">
                        <div className="Box Box-item">
                            <h2 className="Heading--1">{this.props.pubToAdd.name}</h2>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box Box-item"><p>Oops, something went wrong.</p></div>
                    </div>
                </form>
            )
        }

        return (
            <LocationDetails
                name={this.props.pubToAdd.name}
                onSave={this.saveLocation.bind(this)}
                onFormChange={this.onFormChange.bind(this)}
                hasOutsideSpace={this.props.pubToAdd.has_outside_space}
                hasGarden={this.props.pubToAdd.has_garden}
            />)

    }


    /**
    * React render method
    */
    render() {

        if(!this.props.pubToAdd){
            return null;
        }

        let angleMarker;
        if(!this.state.isSaved) {
            angleMarker = <AngleMarker
                angle={this.state.outdoorAngle}
                onAngleChange={this.onAngleChange.bind(this)}
            />;
        }


        return (

            <div className="Screen Admin-tool">

                <header className="Screen-header">
                    <div className="max-width">
                        {this.getTopPanel()}
                    </div>
                </header>

                <div className="Screen-main max-width">
                    <div className="Box Box-row">
                        <div className="Map Box Box-item Box-item--noPadding">
                            <Map
                                centre={{
                                    lat: this.props.pubToAdd.geometry.location.lat(),
                                    lng: this.props.pubToAdd.geometry.location.lng()
                                }}
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
    * Event handler for when angle marker changes
    * @param {number} angle - the angle in degrees
    */
    onAngleChange(angle) {
        this.setState({outdoorAngle: angle});
    }


    /**
    * Handle events of controlled form fields
    * @param {SyntheticEvent} e - the event from the checkboxes
    */
    onFormChange(e) {
        let checkBox = e.target;
        let newState = {...this.state};
        newState[checkBox.name] = checkBox.checked;
        this.setState(newState);
    }


    /**
     * Persist data through the service to the API
     */
    saveLocation(e) {
        e.preventDefault();
        savePub(this.props.pubToAdd.place_id, this.state)
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
    * Cancel adding this pub
    */
    cancel(e) {
        e.preventDefault();
        hashHistory.push('/add');
    }


}
