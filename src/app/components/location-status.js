import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as positionActions from '../actions/position';

class LocationStatus extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentWillMount() {
        if(this.props.isRealPosition && !this.props.isGPSPosition){
            this.props.getAddress(this.props.centre);
        }
    }

    render() {

        let locationTxt;
        if(this.props.address){
            locationTxt = this.props.address;
        } else
        if(this.props.isGPSPosition){
            locationTxt = 'Current Location';
        } else
        if(!this.props.isRealPosition){
            locationTxt = 'Shoreditch, London'
        } else {
            locationTxt = 'Set location'
        }

        return (
            <div className="Box Box-row">
                <Link to="/locate" className="Box Box-item Button--locationStatus">
                    <span className="Button--locationStatus-label">Start:</span> {locationTxt}
                </Link>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    const { isGPSPosition, isRealPosition, centre, address } = state.position;

    return {
        isGPSPosition, isRealPosition, centre, address
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const boundPositionActions = bindActionCreators(positionActions, dispatch);

    return {
        getAddress: (centre) => {
            boundPositionActions.getAddress(centre);
        }
    }
}

const LocationStatusContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationStatus)

export default LocationStatusContainer;
