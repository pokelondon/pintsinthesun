import React from 'react';
import { Link } from 'react-router'

import { fetchBuildings } from '../services/overpass';

import ThreeD from '../components/threed';

class Pubs extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            buildings: [],
        };
    }

    componentDidMount() {
        let [lng, lat] = this.props.location.coordinates;
        fetchBuildings(lat, lng)
            .then(buildings => this.setState({buildings}));
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
                    buildings={this.state.buildings}
                />
            </div>
        )
    }
}

Pubs.propTypes = {
    name: React.PropTypes.string.isRequired,
    location: React.PropTypes.shape([
      React.PropTypes.number, React.PropTypes.number
    ]),
    distance: React.PropTypes.number,
    date: React.PropTypes.instanceOf(Date)
}

export default Pubs;

