import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

const Skycons = require('skycons')(window);


class WeatherIcon extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            skycons: new Skycons({color: '#000'})
        };
    }

    componentDidMount() {
        this.state.skycons.add(ReactDOM.findDOMNode(this), Skycons[this.props.icon]);
        this.state.skycons.play();
    }

    componentWillReceiveProps(nextProps) {
        this.state.skycons.set(ReactDOM.findDOMNode(this), Skycons[nextProps.icon]);
    }

    componentWillUnmount() {
        this.state.skycons.pause();
        this.state.skycons.remove(ReactDOM.findDOMNode(this));
    }

    play() {
        this.state.skycons.play();
    }

    pause() {
        this.state.skycons.pause();
    }

    render() {
        let props = {};
        for(let prop in this.props){
            props[prop] = this.props[prop];
        }
        delete props.autoplay;
        return (
            <canvas {...props} className="WeatherIcon" />
        )
    }
}

WeatherIcon.propTypes = {
    color: React.PropTypes.string,
    icon: React.PropTypes.oneOf([
        'CLEAR_DAY',
        'CLEAR_NIGHT',
        'PARTLY_CLOUDY_DAY',
        'PARTLY_CLOUDY_NIGHT',
        'CLOUDY',
        'RAIN',
        'SLEET',
        'SNOW',
        'WIND',
        'FOG'
    ]).isRequired
}


const mapStateToProps = (state, ownProps) => {
    const { weatherNow, isFetching } = state.weather;
    let icon = 'CLEAR_DAY';
    if(weatherNow.icon && !isFetching) {
        icon = weatherNow.icon.toUpperCase().replace(new RegExp('-', 'g'), '_');
    }
    return {
        icon
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const WeatherIconContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WeatherIcon)

export default WeatherIconContainer;
