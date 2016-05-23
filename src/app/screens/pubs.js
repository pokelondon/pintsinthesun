import React from 'react';
import { Link } from 'react-router'

import { getSuggestions, AFTERNOON } from '../api';

import ThreeD from '../components/threed';


class Pub extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        let { lat, lng } = this.props.params;
        getSuggestions(AFTERNOON, { lat, lng }).then(items => this.setState({items: items.items}));
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
                    <h2>{item.name}</h2>
                    <ThreeD centre={{lat: item.lat, lng: item.lng}} date={new Date()} />
                    <p>Lorem ipsum</p>
                </div>
            )
        }
    }
}

Pub.propTypes = {
}

export default Pub;
