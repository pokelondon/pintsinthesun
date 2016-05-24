import React from 'react';
import { Link } from 'react-router';

import { getLocation } from '../services/location';
import { getPubs } from '../services/foursquare';

import Map from '../components/map';

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            centre: {lat: 51.526, lng: -0.082},
            angle: 0
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

    onIncrementAngle() {
        this.setState({angle: this.state.angle + 1});
    }

    onDecrementAngle() {
        this.setState({angle: this.state.angle - 1});
    }

    render() {
        let { lat, lng } = this.state.centre;
        return (
            <div>
                <Map
                    markers={[]}
                    centre={this.state.centre}
                    onCenterChanged={centre => this.setState({centre})}

                    angle={this.state.angle}
                    onIncrement={this.onIncrementAngle.bind(this)}
                    onDecrement={this.onDecrementAngle.bind(this)}
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
