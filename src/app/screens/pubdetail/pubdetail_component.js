import React from 'react';
import Slider from 'rc-slider';
import { Link } from 'react-router';
import classnames from 'classnames';

import ThreeD from '../../components/threed';
import WeatherIcon from '../../components/weathericon';
import Suggestion from '../../components/suggestion';
import Rational from '../../components/rational';


class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

    }

    componentWillMount() {
        this.setState({localDate: new Date(this.props.date.getTime())});
    }

    onSliderChange(value) {
        var current = this.state.localDate;
        //dont modify globlly on change anymore. Do it on its own event instead.
        //this.props.updateTime(new Date(current.setHours(value)));
        this.setState({localDate: new Date(current.setHours(value)) });
    }

    applyLocalTimeToGlobal(){
        this.props.updateTime(this.state.localDate);
        this.setState({localDate: new Date(this.state.localDate.getTime())});
    }

    sliderTipFormatter(value) {
        return `${value}:00`;
    }

    launchLocationModal(e) {
        e.nativeEvent.preventDefault();
        this.props.launchLocationModal();
    }

    weatherTime() {
        const times = {
            morning: 'this morning',
            afternoon: 'this afternoon',
            evening: 'this evening',
            now: 'now'
        }
        return times[this.props.timeRange];
    }

    getTimeApplyButtonClassNames() {
        return classnames({
            'Button--secondary': true,
            'Button--applyTime': true,
            'negative-margin': true,
            'Button--disabled': this.isLocalTimeGlobalTime()
        });
    }

    isLocalTimeGlobalTime() {
        return this.props.date.getHours() === this.state.localDate.getHours();
    }

    render() {
        if(this.props.isFetching) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Loading</p>
                        <div className="Box Box-row">
                            <p>Finding you somewhere</p>
                        </div>
                    </div>
                </div>
            )
        } else if(this.props.isLocating) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Locating</p>
                        <div className="Box Box-row">
                            <p>Scrabbling around</p>
                        </div>
                    </div>
                </div>
            )
        } else if(!this.props.pub) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">No pubs found</p>
                        <div className="Box Box-row">
                            <p>No sunny pubs found in this area. Maybe try <a onClick={this.launchLocationModal.bind(this)} href="#">looking somewhere else</a>, or a <Link to="/">different time of day</Link>?</p>
                        </div>
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
            <div className="Screen Pub-detail">

                <header className="Screen-header">
                    <div className="max-width">
                        <Suggestion name={name} timeRange={this.props.timeRange} />
                        <div className="Box Box-row">
                            <div className="Box-item">
                                <span>{neighbourhood ? `${neighbourhood} &mdash; ` : ''}{distance.toFixed(1)}{distanceUnit} away</span>
                                <a className="Map-icon" target="_blank" href={`http://maps.google.com/?q=${lat},${lng}`}><img src="/img/icons/map-icon.svg" width="20" height="20" /></a>
                            </div>
                        </div>
                        <div className="Box Box-row flex-wrap">
                            <div className="Box-item Box-item--halfCol--fixed">
                                Best for sun: 13:32-17:23
                            </div>
                            <div className="Box-item Box-item--halfCol--fixed">
                                Weather {this.weatherTime()}: <WeatherIcon />
                            </div>
                        </div>
                    </div>
                </header>


                <div className="Screen-main">
                    <div className="max-width">
                        <div className="Box Box-row flex-wrap no-padding">
                            <div className="Box-item Box-item--halfCol Box-item--responsiveBorders">
                                <ThreeD
                                    centre={{lat, lng}}
                                    _date={this.props.date}
                                    date={this.state.localDate}
                                />

                                <div className="SliderContainer">
                                    <Slider
                                        min={7}
                                        max={21}
                                        step={1}
                                        included={false}
                                        defaultValue={this.props.date.getHours()}
                                        className='Slider'
                                        onChange={this.onSliderChange.bind(this)}
                                        tipFormatter={this.sliderTipFormatter.bind(this)}
                                        marks={ {7: '7:00', 14: '14:00', 21: '21:00'} }
                                    />
                                </div>
                                <button disabled={this.isLocalTimeGlobalTime()} className={this.getTimeApplyButtonClassNames()} onClick={this.applyLocalTimeToGlobal.bind(this)}>What other pubs are good at {this.state.localDate.getHours()}:00?</button>
                            </div>
                            <Rational pub={this.props.pub} />
                        </div>

                        { ( () => {
                            let pubsLeft = this.props.filteredPubs.length - this.props.filteredIndex - 1;
                            let btnCopy = `Show me another one (${pubsLeft} more)`;
                            if(pubsLeft == 0){
                                btnCopy = 'Show me the first one again!';
                            }

                            if(this.props.filteredPubs.length > 1){
                                return (
                                <div className="Box Box-row no-padding">
                                    <div className="Box-item no-padding">
                                        <button className="Button--primary" onClick={this.props.incrementCurrentPub}>{btnCopy}</button>
                                    </div>
                                </div>
                                )
                            }
                        })() }

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
