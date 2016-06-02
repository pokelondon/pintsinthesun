import React from 'react';

class WeatherIcon extends React.Component {

    render() {
        return (
            <i className="WeatherIcon"></i>
        )
    }
}

WeatherIcon.propTypes = {
    weatherClass: React.PropTypes.string
}

export default WeatherIcon;


