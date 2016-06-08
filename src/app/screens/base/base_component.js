import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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

    closePulldownMenu() {
        this.setState({
            isPulldownOpen: false
        });
    }

    render() {
        let headerButtons;
        if(this.state.isPulldownOpen){
            headerButtons = <button key="close" className="CloseLink" onClick={this.closePulldownMenu.bind(this)}></button>
        } else {
            headerButtons = <button key="search" className="SearchLink" onClick={this.openPulldownMenu.bind(this, 'locationMenu')}></button>
        }
        return (
            <div>
                <header className="Header">
                    <div className="max-width">
                        <h1 className="LogoType">
                            <Link to="/">
                                <span title="Pints In (or Near) The Sun">Pints</span> in the Sun
                            </Link>
                        </h1>
                        <ReactCSSTransitionGroup transitionName="fadeIn"  transitionEnterTimeout={500} transitionLeave={false}>
                            {headerButtons}
                        </ReactCSSTransitionGroup>
                    </div>
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
