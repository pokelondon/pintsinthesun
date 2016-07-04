import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as positionActions from '../actions/position';

class Citymapper extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {

        let [lng, lat] = this.props.pub.location.coordinates;

        let positionStr = ``;
        if(this.props.isRealPosition){
            positionStr = `${this.props.centre.lat},${this.props.centre.lng}`;
        }
        return (
            <p className="Para--large">
                <a target="_blank" href={`https://citymapper.com/directions?startcoord=${positionStr}&endcoord=${lat},${lng}&endname=${this.props.pub.name}&arriveby=${encodeURIComponent(this.props.date.toISOString())}`}>
                Citymapper link</a>
            </p>);
    }
}


const mapStateToProps = (state, ownProps) => {
    const {
        date,
        filteredPubs,
        filteredIndex,
        centre,
        isRealPosition
    } = state.position;

    console.log('filteredPubs', filteredPubs);
    console.log('filteredIndex', filteredIndex);


    return {
        date,
        centre,
        isRealPosition,
        pub: filteredPubs[filteredIndex]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

const CitymapperContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Citymapper)

export default CitymapperContainer;
