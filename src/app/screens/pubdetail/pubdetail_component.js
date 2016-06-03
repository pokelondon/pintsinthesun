import React from 'react';
import Slider from 'rc-slider';

import ThreeD from '../../components/threed';
import WeatherIcon from '../../components/weathericon';
import Suggestion from '../../components/suggestion';
import Rational from '../../components/rational';


class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onSliderChange(value) {
        var current = this.props.date;
        this.props.updateTime(new Date(current.setHours(value)));
    }

    render() {
        if(this.props.isFetching) {
            return (
                <div className="Screen-header">
                    <p className="Heading--1">Loading</p>
                    <div className="Box Box-row">
                        <p>Finding you somewhere</p>
                    </div>
                </div>
            )
        } else if(this.props.isLocating) {
            return (
                <div className="Screen-header">
                    <p className="Heading--1">Locating</p>
                    <div className="Box Box-row">
                        <p>Scrabbling around</p>
                    </div>
                </div>
            )
        } else if(!this.props.pub) {
            return (
                <div className="Screen-header">
                    <p className="Heading--1">Error</p>
                    <div className="Box Box-row">
                        <p>Oh crap.</p>
                    </div>
                </div>
            )
        }
        let { distance, location, name, neighbourhood } = this.props.pub;
        let [lng, lat] = location.coordinates;
        var distanceUnit = 'm';
        if (distance > 1000) {
            distance = distance / 1000;
            distanceUnit = 'Km';
        }
        return (
            <div className="Screen">
                <header className="Screen-header">
                    <Suggestion name={name} />
                    <div className="Box Box-row">
                        <div className="Box-item">
                            <span>{neighbourhood ? `${neighbourhood} &mdash; ` : ''}{distance.toFixed(1)}{distanceUnit} away</span>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box-item">
                            Best for sun: 13:32-17:23
                        </div>
                        <div className="Box-item">
                            Weather now: <WeatherIcon />
                        </div>
                    </div>
                </header>
                <div className="Screen-main">
                    <div className="Box">
                        <ThreeD
                            centre={{lat, lng}}
                            date={this.props.date}
                        />

                        <div className="SliderContainer">
                            <Slider
                                min={6}
                                max={21}
                                step={1}
                                included={false}
                                defaultValue={this.props.date.getHours()}
                                className='Slider'
                                onChange={this.onSliderChange.bind(this)}
                            />
                        </div>
                    </div>
                    <Rational pub={this.props.pub} />
                    <div className="Box">
                        <button className="Button--primary" onClick={this.props.incrementCurrentPub}>Show me another {this.props.filteredIndex +1}/{this.props.filteredPubs.length}</button>
                    </div>
                </div>
            </div>
        )
    }
}

PubDetail.propTypes = {
    isFetching: React.PropTypes.bool.isRequired,
    isLocating: React.PropTypes.bool.isRequired,
    date: React.PropTypes.instanceOf(Date).isRequired,
    items: React.PropTypes.array,
    filteredPubs: React.PropTypes.array.isRequired,
    updateTime: React.PropTypes.func.isRequired,
    incrementCurrentPub: React.PropTypes.func,
    filteredIndex: React.PropTypes.number.isRequired,
    pub: React.PropTypes.shape({
        neighbourhoot: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    })
}

export default PubDetail;

