import React from 'react';
import { Link } from 'react-router';


class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let { lat, lng } = this.props.centre;
        return (
            <div>
                <p>{this.props.isLocating ? 'Locating you' : 'Found ya'}</p>
                <p>{lat}, {lng}</p>
                <Link className="Button Button--primary" to='/pubs'>
                    Find somewhere NOW
                </Link>
                <Link className="Button" to='/locate'>
                    Map
                </Link>
            </div>
        )
    }
}

Start.propTypes = {
    centre: React.PropTypes.shape({
      lat: React.PropTypes.number,
      lng: React.PropTypes.number
    }),
    date: React.PropTypes.instanceOf(Date),
    isLocating: React.PropTypes.bool
}

export default Start;

