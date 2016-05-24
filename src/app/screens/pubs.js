import React from 'react';
import { Link } from 'react-router'

import ThreeD from '../components/threed';

import { fetchBuildings } from '../services/overpass';
import { getSuggestions, AFTERNOON } from '../services/api';


class Pub extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        // TODO get this globaler.
        let date = new Date();
        date.setHours(10);
        this.state = {
            items: [],
            buildings: [],
            date
        };
    }

    componentDidMount() {
        let { lat, lng } = this.props.params;
        getSuggestions(this.state.date, { lat, lng })
            .then(items => this.setState({items: items.items}))
            .then(() => this.fetchBuildings());
    }

    fetchBuildings() {
        let item = this.state.items[0];
        let centre = item.location.coordinates;
        fetchBuildings(centre[1], centre[0])
            .then(buildings => this.setState({buildings}));
    }

    render() {
        if(!this.state.items.length) {
            return (
                <div className="Pub">
                    <h2>Loading</h2>
                </div>
            )
        }
        else {
            let item = this.state.items[0];
            let centre = item.location.coordinates;
            return (
                <div className="Pub">
                    <h2 className="Pub-name">{item.name}</h2>
                    <p className="Pub-distance">0.2Km away</p>
                    <ThreeD
                        centre={{lat: centre[1], lng: centre[0]}}
                        date={this.state.date}
                        buildings={this.state.buildings}
                    />
                    <p>Lorem ipsum</p>
                </div>
            )
        }
    }
}

Pub.propTypes = {
}

export default Pub;
