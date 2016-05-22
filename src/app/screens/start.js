import React from 'react';
import { Link } from 'react-router';

import Map from '../components/map';
import { getPubs } from '../foursquare';

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            centre: {lat: 51.6, lng: -0.1}
        }
    }

    onPressFind() {
        console.log(this.state.centre);
        getPubs(this.state.centre).then(venues => console.log(venues)).catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                <Map
                    markers={[]}
                    centre={this.state.centre}
                    onCenterChanged={centre => this.setState({centre})}
                />
                <Link className="Button Button--primary" to="/pubs/1">
                    Find somewhere now
                </Link>

                <button className="Button Button--primary" onClick={() => this.onPressFind()}>
                    Make Request
                </button>
            </div>
        )
    }
}

Start.propTypes = {
}

export default Start;
