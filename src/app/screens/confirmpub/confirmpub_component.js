import React, { Component, PropTypes } from 'react';
import Map from '../../components/admin/map';
import { getPubs } from '../../services/foursquare';
import AngleMarker from '../../components/admin/AngleMarker';
import { existsInLocalStorage } from '../../services/local';
import { savePub, checkPubsExist } from '../../services/pintsinthesun';
import { getDistance } from '../../utils/Geo';
import { hashHistory, Link } from 'react-router';


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
            <form className="Location-details">

                <div className="Box Box-row">
                    <div className="Box Box-item">
                        <h2 className="Heading--1">{this.props.pubToAdd.name}</h2>
                    </div>
                </div>
                <div className="Box Box-row flex-wrap">
                    <div className="Box Box-item Box-item--noPadding Property-option">
                        <label>
                            <input onChange={this.onFormChange.bind(this)} type="checkbox" name="hasOutsideSpace" value="true" checked={this.props.hasOutsideSpace} /> Outside space
                        </label>
                    </div>
                    <div className="Box Box-item Box-item--noPadding Property-option">
                        <label>
                            <input onChange={this.onFormChange.bind(this)} type="checkbox" name="hasGarden" value="true" checked={this.props.hasGarden} /> Garden
                        </label>
                    </div>
                </div>
                <div className="Box Box-row">
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.cancel.bind(this)} className='Button--secondary'>Cancel</button>
                    </div>
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.saveLocation.bind(this)} className='Button--secondary'>Save</button>
                    </div>
                </div>

            </form>
        )
    }


    /**
    * React render method
    */
    render() {

        if(!this.props.pubToAdd){
            return null;
        }

        const angleMarker = <AngleMarker
            angle={this.state.outdoorAngle}
            onAngleChage={this.onAngleChange.bind(this)}
        />;


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
        let tempState = Object.assign({}, this.state);
        tempState[checkBox.name] = checkBox.checked;
        this.setState(tempState);
    }


    /**
     * Persist data through the service to the API
     */
    saveLocation() {

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
    cancel() {
        hashHistory.push('/add');
    }


}
