import React from 'react';
import Slider from 'rc-slider';
import { Link } from 'react-router';
import classnames from 'classnames';

import ThreeD from '../../components/threed';
import WeatherIcon from '../../components/weathericon';
import Suggestion from '../../components/suggestion';
import Rational from '../../components/rational';
import StaticMap from '../../components/static-map';
import LocationStatus from '../../components/location-status';
import GA from 'react-ga';

class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.isTimeApplyBtnVisible = false;
    }

    componentWillMount() {

        this.setState({
            localDate: new Date(this.props.date.getTime()),
            visibleTab: 'sun'
        });
    }

    onSliderChange(value) {
        var current = this.state.localDate;
        //dont modify globlly on change anymore. Do it on its own event instead.
        //this.props.updateTime(new Date(current.setHours(value)));
        this.setState({localDate: new Date(current.setHours(value)) });
    }

    applyLocalTimeToGlobal(){
        this.isTimeApplyBtnVisible = false;
        this.props.updateTime(this.state.localDate);
        this.setState({localDate: new Date(this.state.localDate.getTime())});
        GA.event({
            category: 'Filter',
            action: 'Set Time Range',
            label: 'Slider'
        });
    }

    sliderTipFormatter(value) {
        return `${value}:00`;
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
            'Button--applyTime': true,
            'visibility-hidden': (this.isLocalTimeGlobalTime() && !this.isTimeApplyBtnVisible)
        });
    }

    isLocalTimeGlobalTime() {
        if(this.props.date.getHours() === this.state.localDate.getHours()){
            return true;
        }
        this.isTimeApplyBtnVisible = true;
        return false;
    }

    showTab(tab){
        this.setState({visibleTab: tab});
        GA.event({
            category: 'UI',
            action: 'Toggle pub tab',
            label: tab
        });
    }

    render() {

        let { distance, location, name } = this.props.pub;
        let [lng, lat] = location.coordinates;
        var distanceUnit = 'm';
        if (distance > 1000) {
            distance = distance / 1000;
            distanceUnit = 'Km';
        }
        return (
            <div className="Pub-detail">

                <h2 className="Heading--2 DetailsHeading">{this.props.pub.name}</h2>

                <div className="Box Box-row flex-wrap">
                    <div className="Box-item Box-item--noPadding Box-item--halfCol Box-item--responsiveBorders">

                        {this.props.showMap &&
                            <div className="MapTabs">
                                <button className={(this.state.visibleTab === 'sun') ? 'Button Button--tab Button--tab--active' : 'Button Button--tab'} onClick={this.showTab.bind(this, 'sun')}>Sun position</button>
                                <button className={(this.state.visibleTab === 'map') ? 'Button Button--tab Button--tab--active' : 'Button Button--tab'} onClick={this.showTab.bind(this, 'map')}>Map</button>
                            </div>
                        }

                        <div className="PubTabContent">

                            { ( () => {
                                if(this.state.visibleTab === 'sun'){
                                    return (
                                        <div>
                                            <ThreeD
                                                centre={{lat, lng}}
                                                date={this.state.localDate}
                                                renderTransitionDirection={this.props.renderTransitionDirection}
                                                incrementCurrentPub={this.props.incrementCurrentPub}
                                                decrementCurrentPub={this.props.decrementCurrentPub}
                                            />

                                            <div className="SliderContainer">
                                                <Slider
                                                    min={7}
                                                    max={21}
                                                    step={1}
                                                    included={false}
                                                    defaultValue={this.state.localDate.getHours()}
                                                    className='Slider'
                                                    onChange={this.onSliderChange.bind(this)}
                                                    tipFormatter={this.sliderTipFormatter.bind(this)}
                                                    marks={ {7: '7:00', 14: '14:00', 21: '21:00'} }
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            })()}

                            { ( () => {
                                if(this.state.visibleTab === 'map') {
                                    return (
                                        <StaticMap centre={{lat, lng}} />
                                    )
                                }
                            })()}

                        </div>

                    </div>

                    <Rational isRealPosition={this.props.isRealPosition} arrivalTime={this.state.localDate} centre={{lat, lng}} pub={this.props.pub} />

                </div>

                <div className="Box Box-row">
                    <div className="Box-item">
                        <span>{distance.toFixed(1)}{distanceUnit} away</span>
                    </div>
                </div>

                <div className="Box Box-row flex-wrap">
                    <div className="Box-item Box-item--halfCol--fixed">
                        Best for sun: 13:32-17:23
                    </div>
                    <div className="WeatherIndicator Box-item Box-item--halfCol--fixed">
                        <div className="WeatherIndicator-label">Weather {this.weatherTime()}:</div> <WeatherIcon />
                    </div>
                </div>

            </div>

        )
    }
}

PubDetail.propTypes = {
    date: React.PropTypes.instanceOf(Date).isRequired,
    updateTime: React.PropTypes.func.isRequired,
    pub: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    }),
    showMap: React.PropTypes.bool,
}

PubDetail.defaultProps = {
    showMap: false
}



export default PubDetail;
