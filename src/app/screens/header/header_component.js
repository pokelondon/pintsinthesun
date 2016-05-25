import React from 'react';
import { Link } from 'react-router';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <header className="Header">
                    <div className="Pint--small">
                        <img className="Pint-img" src="/img/pint.png" alt="pint" />
                        <div className="Pint-shad"></div>
                    </div>
                    <h1>
                        <a href="#/">
                            <span title="Pints In (or Near) The Sun">Pints</span> in the Sun
                        </a>
                    </h1>
                    <p className="intro">Find a pub near you that won't be in the shade</p>
            </header>
        )
    }
}

Header.propTypes = {
    date: React.PropTypes.instanceOf(Date),
}

export default Header;
