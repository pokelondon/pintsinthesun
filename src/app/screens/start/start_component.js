import React from 'react';
import { Link } from 'react-router';


class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div>
                <Link className="Button Button--primary" to='/pubs'>
                    Find somewhere RIGHT NOW
                </Link>
                <Link className="Button" to='/locate'>
                    Map
                </Link>

                <button className="Button">
                    or how about later
                </button>
            </div>
        )
    }
}

Start.propTypes = {
    date: React.PropTypes.instanceOf(Date)
}

export default Start;

