import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class Rational extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rational: this.getRationalText()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pub.name !== this.props.pub.name) {
            this.setState({rational: this.getRationalText()});
        }
    }

    getRationalText() {
        var response = [];

        response.push('This place looks like it could be good.');

        if(this.props.pub) {

            if(this.props.pub.has_terrace) {
                response.push(Rational.TERRACE_SENTENCES[parseInt(Rational.TERRACE_SENTENCES.length * Math.random(), 10)]);
            }

            let building_to_the_west_sentences = Rational.BUIDLING_TO_THE_WEST_SENTENCES[this.props.pub.building_to_the_west ? 1 : 0];
            if(building_to_the_west_sentences) {
                response.push(building_to_the_west_sentences[parseInt(building_to_the_west_sentences.length * Math.random(), 10)]);
            }
        }

        return response;
    }

    getWeatherStatement() {
        if(this.props.weather) {
            let weather_sentences = Rational.WEATHER_SENTENCES[this.props.weather];
            return weather_sentences[parseInt(weather_sentences.length * Math.random(), 10)];
        }
    }

    render() {
        let rational = this.state.rational.join(' ');
        let weatherStatement = this.getWeatherStatement();
        return (
            <div className="Box Para--large">
                <p dangerouslySetInnerHTML={{__html: rational}}></p>
                <p>{weatherStatement}</p>
            </div>
        )
    }
};

Rational.propTypes = {
    pub: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    }).isRequired,
    weather: React.PropTypes.oneOf([
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
    ])
};

Rational.WEATHER_SENTENCES = {
    'CLEAR_DAY': ['The sun\'s out! woop!', 'What a lovely day'],
    'CLEAR_NIGHT': ['It\'s pretty clear!', 'What a lovely day'],
    'PARTLY_CLOUDY_DAY': ['Might be a bit cloudy mind', 'Too bad it\'s a bit cloudy.'],
    'PARTLY_CLOUDY_NIGHT': ['It\'ll be cloudy this evening.'],
    'CLOUDY': ['Doh! it\'s pretty cloudy.', 'It\'s quite cloudy :(', 'It\'s cloudy right now.'],
    'RAIN': ['Shame it\'s raining!', 'It\'s raining. Dammit.', 'Urgh, it\'s rainy :('],
    'SLEET': ['But, it\'s sleeting!', 'it\'s wet out.'],
    'SNOW': ['But, it\'s snowing. You crazy?!'],
    'WIND': ['Watch out for the wind!'],
    'FOG': ['But it\'s foggy.']
}

Rational.BUIDLING_TO_THE_WEST_SENTENCES = [
    ['There\'s nothing much blocking the sun <em>to the west</em>.', 'No buidlings <em>west of here.</em> to get in the way', 'Not much <em>over the street</em> to block the sun.'],
    ['There is a buidling next door, it might block the sun.', 'Look out for <em>shadows from over the road</em>.']
]

Rational.TERRACE_SENTENCES = [
    'It has a <em>terrace</em>!',
    'Checkout the <em>terrace</em>!',
    'Jackpot! There\'s a <em>terrace</em> here!'
]

const mapStateToProps = (state, ownProps) => {
    const { weatherNow, isFetching } = state.weather;
    let weather = 'CLEAR_DAY';
    if(weatherNow.icon && !isFetching) {
        weather = weatherNow.icon.toUpperCase().replace(new RegExp('-', 'g'), '_');
    }
    return {
        weather
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const RationalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Rational)

export default RationalContainer;
