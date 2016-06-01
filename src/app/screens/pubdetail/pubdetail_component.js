import React from 'react';
import { Link } from 'react-router'

import ThreeD from '../../components/threed';

class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        if(this.props.isFetching) {
            return (
                <p>Loading Detail</p>
            )
        } else if(this.props.isLocating) {
            return (
                <p>Locating</p>
            )
        } else if(!this.props.pub) {
            return (
                <p>Error</p>
            )
        }
        let { distance, location, name } = this.props.pub;
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
                />
            </div>
        )
    }
}

PubDetail.propTypes = {
    isFetching: React.PropTypes.bool.isRequired,
    isLocating: React.PropTypes.bool.isRequired,
    date: React.PropTypes.instanceOf(Date).isRequired,
    items: React.PropTypes.array,
    pub: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    })
}

export default PubDetail;

