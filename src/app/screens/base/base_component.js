import React from 'react';
import { Link } from 'react-router';
import Pulldown from '../pulldown/pulldown';


class Base extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            isPulldownOpen: false,
            pulldownMenu: null
        }
    }

    componentDidMount() {
        console.log('Requesting position');
        this.props.fetchPosition();
    }

    openPulldownMenu(menu) {
        this.setState({
            isPulldownOpen: true,
            pulldownMenu: menu
        });
    }

    closePulldownMenu(menu) {
        this.setState({
            isPulldownOpen: false
        });
    }

    render() {
        return (
            <div>
                <header className="Header">
                    <Link className="InfoLink" to='/about'>What?</Link>
                    <a className="SearchLink" onClick={this.openPulldownMenu.bind(this, 'locationMenu')}>Search</a>
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
                <Pulldown
                    onClose={this.closePulldownMenu.bind(this)}
                    pulldownMenu={this.state.pulldownMenu}
                    isOpen={this.state.isPulldownOpen}
                />
            </div>
        )
    }
}

Base.propTypes = {
    fetchPosition: React.PropTypes.func.isRequired,
    date: React.PropTypes.instanceOf(Date),
    isLocating: React.PropTypes.bool,
    centre: React.PropTypes.shape({
        lat: React.PropTypes.number,
        lng: React.PropTypes.number
    }),

}

export default Base;
