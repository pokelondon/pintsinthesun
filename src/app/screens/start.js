import React from 'react';
import { Link } from 'react-router';

import { getLocation } from '../location';
import Map from '../components/map';
import { getPubs } from '../foursquare';

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            centre: {lat: 51.526, lng: -0.082}
        }
    }

    componentDidMount() {
        getLocation().then(centre => this.setState({centre}));
    }

    onPressFind() {
        getPubs(this.state.centre)
            .then(venues => console.log(venues))
            .catch(err => console.error(err));
    }

    render() {
        let { lat, lng } = this.state.centre;
        return (
            <div>
                <Map
                    markers={[]}
                    centre={this.state.centre}
                    onCenterChanged={centre => this.setState({centre})}
                />
                <Link className="Button Button--primary" to={`/pubs/${this.state.centre.lat}/${this.state.centre.lng}`}>
                    lnk
                </Link>
            </div>
        )
    }
}

Start.propTypes = {
}

export default Start;
