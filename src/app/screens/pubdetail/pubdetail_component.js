import React from 'react';
import { Link } from 'react-router'

import ThreeD from '../../components/threed';

class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let item = this.props.items[this.props.routeParams.index];
        if(!item) {
            return (
                <p>Error</p>
            )
        }
        let { distance, location, name } = item;
        let [lng, lat] = location.coordinates;
        var distanceUnit = 'm';
        if (distance > 1000) {
            distance = distance / 1000;
            distanceUnit = 'Km';
        }
        return (
            <div className="Pub">
                <h2 className="Pub-name">{name}</h2>
                <p className="Pub-distance">{distance.toFixed(1)}{distanceUnit} away</p>
                <ThreeD
                    centre={{lat, lng}}
                    date={this.props.date}
                    sceneid={name}
                />
            </div>
        )
    }
}

PubDetail.propTypes = {
    routeParams: React.PropTypes.shape({
        index: React.PropTypes.string
    }),
    items: React.PropTypes.array,
    //items: React.PropTypes.shape([{
        //name: React.PropTypes.string.isRequired,
        //location: React.PropTypes.shape([
            //React.PropTypes.number, React.PropTypes.number
        //]).isRequired,
        //distance: React.PropTypes.number,
    //}]),
    date: React.PropTypes.instanceOf(Date).isRequired
}

export default PubDetail;

