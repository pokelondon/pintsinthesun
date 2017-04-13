import React from 'react';
import AngleMarker from './anglemarker';
import LocationDetails from './location_details';
import { updatePub } from '../../services/pintsinthesun';
import Map from './map';

export default class ApprovePub extends React.Component {

    constructor(props){
        super(props);

        //set initial state from props, because we are likely to change them
        this.state = {
            hasGarden: this.props.pub.has_garden,
            hasOutsideSpace: this.props.pub.has_outside_space,
            outdoorAngle: this.props.pub.outdoor_angle
        }
    }

    approvePub() {
        this.updatePubDetails({
            approved: true,
            rejected: false,
            has_garden: this.state.hasGarden,
            has_outside_space: this.state.hasOutsideSpace,
            outdoor_angle: this.state.outdoorAngle
        });
    }

    rejectPub() {
        this.updatePubDetails({approved: false, rejected: true});
    }

    onFormChange(e) {
        let checkBox = e.target;
        let newState = {...this.state};
        newState[checkBox.name] = checkBox.checked;
        this.setState(newState);
    }

    onAngleChange(angle) {
        this.setState({outdoorAngle: angle});
    }


    updatePubDetails(values) {
        updatePub(this.props.pub._id, values)
            .then((result) => {
                this.props.onApproved();
            })
            .catch( (err) => {
                //TODO - handle error
            });
    }

    render() {
        return (
            <div>
                <LocationDetails
                    name={this.props.pub.name}
                    hasOutsideSpace={this.state.hasOutsideSpace}
                    hasGarden={this.state.hasGarden}
                    onFormChange={this.onFormChange.bind(this)}
                />
                <div className="Box Box-row">
                    <div className="Box Map Box-item Box-item--noPadding">
                        <Map
                            centre={{
                                lat: this.props.pub.location.coordinates[1],
                                lng: this.props.pub.location.coordinates[0]
                            }}
                            ref="Map"
                        />
                        <AngleMarker
                            angle={this.state.outdoorAngle}
                            onAngleChange={this.onAngleChange.bind(this)}
                        />
                    </div>
                </div>

                <div className="Box Box-row">
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.approvePub.bind(this)} className="Button--secondary">Approve</button>
                    </div>
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.rejectPub.bind(this)} className="Button--secondaryAlt">Reject</button>
                    </div>
                </div>
            </div>
        )
    }
}