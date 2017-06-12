import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import CitymapperLink from './citymapper';

class Rational extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rational: this.getRationalText(),
            intro: this.getIntroText()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pub.name !== this.props.pub.name) {
            this.setState({
                rational: this.getRationalText(),
                intro: this.getIntroText()
            });
        }
    }

    getIntroText() {
        const suggestion = Rational.SUGGESTIONS[parseInt(Rational.SUGGESTIONS.length * Math.random(), 10)];
        return `${suggestion} <em>${this.props.pub.name.toUpperCase()}?</em> It's been recommended before&hellip;`;
    }

    getRationalText() {
        var response = [];

        if(this.props.pub) {

            if(this.props.pub.has_outside_space) {
                response.push(Rational.OUTSIDE_SPACE_SENTENCES[parseInt(Rational.OUTSIDE_SPACE_SENTENCES.length * Math.random(), 10)]);
            }

            if(this.props.pub.has_garden) {
                let gardenSentence = Rational.GARDEN_SENTENCES[parseInt(Rational.GARDEN_SENTENCES.length * Math.random(), 10)];
                if(this.props.pub.has_outside_space) {
                    //replace the trailing ! with a comma, to allow more to be added...
                    response[response.length-1] = response[response.length-1].slice(0, -1) + ', and ';
                    gardenSentence = gardenSentence[0].toLowerCase() + gardenSentence.substring(1);
                }
                response.push(gardenSentence);
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
        const rational = this.state.rational.join(' ');
        const weatherStatement = this.getWeatherStatement();
        return (
            <div className="Rational Box Box-item Box-item--noPadding Box-item--halfCol Box-item--responsiveBorders">
                <div className="box-child-margin">
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: this.state.intro}}></p>
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: rational}}></p>
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: weatherStatement}}></p>
                </div>
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
    'CLEAR_DAY': ['The <em>sun\'s</em> out! woop!', 'What a lovely day'],
    'CLEAR_NIGHT': ['It\'s pretty <em>clear!</em>', 'What a lovely day'],
    'PARTLY_CLOUDY_DAY': ['Might be a bit <em>cloudy</em> mind!', 'Too bad it\'s a bit <em>cloudy.</em>'],
    'PARTLY_CLOUDY_NIGHT': ['It\'ll be <em>cloudy</em> this evening.'],
    'CLOUDY': ['Doh! it\'s pretty <em>cloudy.</em>', 'It\'s quite <em>cloudy</em> :(', 'It\'s <em>cloudy</em> right now.'],
    'RAIN': ['Shame it\'s <em>raining!</em>', 'It\'s <em>raining.</em> Dammit.', 'Urgh, it\'s <em>rainy</em> :('],
    'SLEET': ['But, it\'s <em>sleeting!</em>', 'it\'s <em>wet</em> out.'],
    'SNOW': ['But, it\'s <em>snowing.</em> You crazy?!'],
    'WIND': ['Watch out for the <em>wind!</em>'],
    'FOG': ['But it\'s <em>foggy.</em>']
};

Rational.GARDEN_SENTENCES = [
    'It\'s got a <em>garden!</em>',
    'Checkout the <em>garden!</em>',
    'There\'s a <em>garden!</em>'
];

Rational.OUTSIDE_SPACE_SENTENCES = [
    'There\'s some <em>space outside</em> here!',
    'It\'s got an area <em>outside!</em>',
    'Jackpot! There\'s some <em>outside space</em> here!'
];

Rational.SUGGESTIONS = [
    ['Why don\'t you head down to '],
    ['How about '],
    ['What about '],
    ['How about going to '],
];

const mapStateToProps = (state, ownProps) => {
    const { weatherNow, isFetching } = state.weather;
    let weather = 'CLEAR_DAY';
    if(weatherNow && weatherNow.icon && !isFetching) {
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
