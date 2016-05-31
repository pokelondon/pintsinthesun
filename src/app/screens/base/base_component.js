import React from 'react';
import { Link } from 'react-router';


class Base extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        this.props.fetchPosition();
    }

    render() {
        return (
            <div>
                <header className="Header">
                    <Link className="InfoLink" to='/about'>What?</Link>
                    <div className="Pint--small">
                        <img className="Pint-img" src="/img/pint.png" alt="pint" />
                        <div className="Pint-shad"></div>
                    </div>
                    <h1>
                        <Link to="/">
                            <span title="Pints In (or Near) The Sun">Pints</span> in the Sun
                        </Link>
                    </h1>
                    <p className="intro">Find a pub near you that won't be in the shade</p>
                </header>
                {this.props.children}
            </div>
        )
    }
}

Base.propTypes = {
    fetchPosition: React.PropTypes.func.isRequired,
    date: React.PropTypes.instanceOf(Date),
    isLocating: React.PropTypes.bool
}

export default Base;

