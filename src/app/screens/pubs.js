import React from 'react';
import { Link } from 'react-router'

import Slider from 'rc-slider';

import Pub from '../components/pub';

import { getSuggestions, AFTERNOON } from '../services/api';


class Pubs extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        // TODO get this globaler.
        let date = new Date();
        date.setHours(18);
        this.state = {
            items: [],
            date
        };
    }

    componentDidMount() {
        let { lat, lng } = this.props.params;
        getSuggestions(this.state.date, { lat, lng })
            .then(items => this.setState({items: items.items}));
    }

    onSliderChange(value) {
        const date = new Date(this.state.date);
        date.setHours(value);
        this.setState({date});
    }

    render() {
        if(!this.state.items.length) {
            return (
                <div className="Pub">
                    <h2>Loading</h2>
                </div>
            )
        } else {
            let item = this.state.items[0];
            return (
                <div>
                    <p>{this.state.items.length} Results</p>
                    <Slider min={8} max={22} step={1} included={false} defaultValue={8} onChange={this.onSliderChange.bind(this)}/>
                    <Pub {...item} date={this.state.date} />
                </div>
            )
        }
    }
}

export default Pubs;
