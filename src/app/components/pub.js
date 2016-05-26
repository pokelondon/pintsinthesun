import React from 'react';
import { Link } from 'react-router'

import ThreeD from '../components/threed';

class Pub extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            buildings: [],
        };
    }

    render() {
        let { distance, location, name } = this.props;
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

Pub.propTypes = {
    name: React.PropTypes.string.isRequired,
    location: React.PropTypes.shape([
      React.PropTypes.number, React.PropTypes.number
    ]),
    distance: React.PropTypes.number,
    date: React.PropTypes.instanceOf(Date),
}

export default Pub;

