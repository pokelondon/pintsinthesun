import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as positionActions from '../actions/position';
import GA from 'react-ga';

class Citymapper extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    onLinkClick() {
        GA.event({
            category: 'Navigation',
            action: 'External link',
            label: 'Citymapper'
        });
    }

    render() {

        let [lng, lat] = this.props.pub.location.coordinates;

        let positionStr = ``;
        if(this.props.isRealPosition){
            positionStr = `${this.props.centre.lat},${this.props.centre.lng}`;
        }
        return (
            <div className="CitymapperLink">
                <a onClick={this.onLinkClick.bind(this)} className="Button--secondary" target="_blank" href={`https://citymapper.com/directions?startcoord=${positionStr}&endcoord=${lat},${lng}&endname=${encodeURIComponent(this.props.pub.name)}&arriveby=${encodeURIComponent(this.props.date.toISOString())}`}>
                View on Citymapper</a>
            </div>
        );
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
