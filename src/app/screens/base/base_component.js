import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Pulldown from '../pulldown/pulldown';
import Dialog from '../../components/dialog';

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
        //this.props.fetchPosition();
    }

    getDialog(){
        if(this.props.dialogVisible){
            return (
                <Dialog
                    message={this.props.dialogMessage}
                    moreInfo={this.props.dialogMoreInfo}
                    buttonText="Ok"
                    onButtonClick={this.props.closeDialog}
                />
            )
        }
    }

    render() {
        let headerButtons;
        if(this.props.modal){
            headerButtons = <button key="close" className="CloseLink rollover-scale" onClick={this.props.closeModal}></button>
        } else {
            //headerButtons = <button key="search" className="SearchLink rollover-scale" onClick={this.props.launchLocationModal}></button>
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
                <div className="InfoBox max-width">
                    <div className="InfoBox-arrow"></div>
                    <div className="InfoBox-btnContainer">
                            <button onClick={this.props.launchInfoModal} className="Button--info rollover-scale"><img src="/img/icons/info.svg" /></button>
                    </div>
                    <div className="InfoBox-arrow"></div>
                </div>
                <Pulldown
                    onClose={this.props.closeModal}
                    pulldownMenu={this.props.modal}
                />
                {this.getDialog()}
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
