import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as positionActions from '../actions/position';

class LocationIndicator extends React.Component {

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
        console.log('render', this.props);

        let locationTxt;
        if(this.props.isGPSPosition){
            locationTxt = 'Current Location';
        } else
        if(!this.props.isRealPosition){
            locationTxt = 'Shoreditch, London'
        } else
        if(this.props.address){
            locationTxt = this.props.address;
        }
        return (
            <Link to="/locate">{locationTxt}</Link>
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

const LocationIndicatorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationIndicator)

export default LocationIndicatorContainer;
