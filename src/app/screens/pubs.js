import React from 'react';
import { Link } from 'react-router'

import ThreeD from '../components/threed';

import { fetchBuildings } from '../services/overpass';
import { getSuggestions, AFTERNOON } from '../services/api';


class Pub extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            items: [],
            buildings: []
        };
    }

    componentDidMount() {
        let { lat, lng } = this.props.params;
        getSuggestions(AFTERNOON, { lat, lng })
            .then(items => this.setState({items: items.items}))
            .then(() => this.fetchBuildings());
    }

    fetchBuildings() {
        let item = this.state.items[0];
        fetchBuildings(item.lat, item.lng)
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
            return (
                <div className="Pub">
                    <h2 className="Pub-name">{item.name}</h2>
                    <p className="Pub-distance">0.2Km away</p>
                    <ThreeD
                        centre={{lat: item.lat, lng: item.lng}}
                        date={new Date()}
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
