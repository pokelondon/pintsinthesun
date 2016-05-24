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
        date.setHours(10);
        this.state = {
            centre: {lat: 51.526, lng: -0.082},
            angle: 0,
            date
        }
    }

    componentDidMount() {
        getLocation().then(centre => this.setState({centre}));
        let pos = SunCalc.getPosition(this.state.date, this.state.centre.lat, this.state.centre.lng);
        let angle = pos.azimuth * 180 / Math.PI;
        this.setState({angle});
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
