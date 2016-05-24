import React from 'react';
import { Link } from 'react-router';

import SunCalc from '../lib/suncalc';
import { getLocation } from '../services/location';

import Map from '../components/map';

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        let date = new Date();
        date.setHours(20);

        this.state = {
            centre: {lat: 51.526, lng: -0.182},
            date
        }
    }

    componentDidMount() {
        // No using map.
        // User might want to change location before searching so coords still passed as path
        // TODO this promise sometimes doesnt finish till after
        // this component is unmounted. Another reason to put it up a level
        getLocation().then(centre => this.setState({centre}));
    }

    render() {
        let { lat, lng } = this.state.centre;
        return (
            <div>
                <Link className="Button Button--primary" to={`/pubs/${lat}/${lng}`}>
                    Find somewhere NOW
                </Link>
            </div>
        )
    }
}

Start.propTypes = {
}

export default Start;
