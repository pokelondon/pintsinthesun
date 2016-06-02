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
                    Find somewhere RIGHT NOW {this.props.date.toString()}
                </Link>

                <button className="Button" onClick={this.props.setMorning}>
                    Morning
                </button>

                <button className="Button" onClick={this.props.setAfternoon}>
                    Afternoon
                </button>

                <button className="Button" onClick={this.props.setEvening}>
                    Evening
                </button>
            </div>
        )
    }
}

Start.propTypes = {
    date: React.PropTypes.instanceOf(Date).isRequired,
    setMorning: React.PropTypes.func.isRequired,
    setAfternoon: React.PropTypes.func.isRequired,
    setEvening: React.PropTypes.func.isRequired,
}

export default Start;

