import React from 'react';
import { Link } from 'react-router';
import Logo from '../../components/logo';

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div className="Screen">
                <header className="Screen-header">
                    <div className="Box Box-row max-width">
                        <div className="Box-item no-padding">
                            <Logo />
                        </div>
                    </div>

                </header>

                <div className="Screen-main">
                    <div className="Box Box-row max-width no-padding">
                        <div className="Box-item no-padding">
                            <Link className="Button Button--primary" to='/pubs'>
                                Find the nearest sunny pub <img src="img/icons/search.svg" width="28" />
                            </Link>
                        </div>
                    </div>
                    <div className="Box Box-row max-width no-padding">
                        <div className="Box-item Para--large text-centre">
                            <span className="Circle-or">or</span>
                            Find nearby pubs that will be sunny in the&#8230;
                        </div>
                    </div>

                    <div className="Box Box-row max-width">
                        <div className="Box-item no-padding">
                            <a className="Button--morning" onClick={this.props.setMorning}>
                                <span>Morning</span>
                            </a>
                        </div>
                        <div className="Box-item no-padding">
                            <a className="Button--afternoon" onClick={this.props.setAfternoon}>
                                <span>Afternoon</span>
                            </a>
                        </div>
                        <div className="Box-item no-padding">
                            <a className="Button--evening" onClick={this.props.setEvening}>
                                <span>Evening</span>
                            </a>
                        </div>
                    </div>

                    <div className="InfoBox max-width">
                        <div className="InfoBox-arrow">

                        </div>
                        <div className="InfoBox-btnContainer">
                            <img src="img/icons/info.svg" width="30" />
                        </div>
                        <div className="InfoBox-arrow">

                        </div>

                    </div>
                </div>
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
