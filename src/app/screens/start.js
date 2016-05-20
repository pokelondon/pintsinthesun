import React from 'react';
import { Link } from 'react-router';

import Map from '../components/map';
import { getPubs } from '../foursquare';

class Start extends React.Component {
    constructor(props) {
        super(props)
    }

    onPressFind() {
        let centre = {lat:51.6, lng: -0.1};
        getPubs(centre).then(data => data.json()).then(data => console.log(data.response.venues));
    }

    render() {
        return (
            <div>
                <Map markers={[]} />
                <Link className="Button Button--primary" to="/pubs/1">
                    Find somewhere now
                </Link>

                <button className="Button Button--primary" onClick={this.onPressFind}>
                    Make Request
                </button>
            </div>
        )
    }
}

Start.propTypes = {
}

export default Start;
