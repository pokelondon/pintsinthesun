import React from 'react';
import Slider from 'rc-slider';

import ThreeD from '../../components/threed';
import WeatherIcon from '../../components/weathericon';


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
                <p>Loading Detail</p>
            )
        } else if(this.props.isLocating) {
            return (
                <p>Locating</p>
            )
        } else if(!this.props.pub) {
            return (
                <p>Error</p>
            )
        }
        let { distance, location, name } = this.props.pub;
        let [lng, lat] = location.coordinates;
        var distanceUnit = 'm';
        if (distance > 1000) {
            distance = distance / 1000;
            distanceUnit = 'Km';
        }
        return (
            <div className="Screen">
                <header className="Screen-header">
                    <p className="">
                        <span className="txt-suggestion">Why dont you head down to </span>
                        <span className="Pub-name">{name}</span>
                    </p>
                    <div className="Box Box-row">
                        <div className="Box-item">
                            <span>Marylebone &mdash; {distance.toFixed(1)}{distanceUnit}</span>
                        </div>
                    </div>
                    <div className="Box Box-row">
                        <div className="Box-item">
                            Best for sun: 13:32 - 17:23
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
                    <div className="Box">
                        <p>Its good cos its got a roof terrace, it faces west, and the outside bit faces the sun at the time of day</p>
                    </div>
                    <div className="Box">
                        <button className="Button--primary" onClick={this.props.incrementCurrentPub}>Next {this.props.filteredIndex +1}/{this.props.filteredPubs.length}</button>
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
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    })
}

export default PubDetail;

