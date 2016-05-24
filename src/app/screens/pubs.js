import React from 'react';
import { Link } from 'react-router'
import moment from 'moment';

import ThreeD from '../components/threed';
import Slider from 'rc-slider';

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
        console.log(this.state.date);
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

    onSliderChange(value) {

        let date = this.moment.clone().add(value, 'hours');
        this.setState({date: date.toDate()});
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
                    <Slider min={8} max={22} step={0.5} included={false} defaultValue={8} onChange={this.onSliderChange.bind(this)}/>
                </div>
            )
        }
    }
}

Pub.propTypes = {
}

export default Pub;
