import React from 'react';
import ReactDOM from 'react-dom';

class Suggestion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            suggestion: this.getSuggestionText()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.name !== this.props.name) {
            this.setState({
                suggestion: this.getSuggestionText()
            });
        }
    }

    getSuggestionText() {
        return Suggestion.SUGGESTIONS[parseInt(Suggestion.SUGGESTIONS.length * Math.random())];
    }

    render() {
        let [ first, last ] = this.state.suggestion;
        //last = (last) ? ' ' + last : '?';
        return (
            <p className="Heading--1">
                <span className="">{first} </span>
                <span className="txt-suggestion">{this.props.name}</span>
                <span className=""> {last} {Suggestion.TIMES[this.props.timeRange]}?</span>
            </p>
        )
    }
};

Suggestion.propTypes = {
    name: React.PropTypes.string.isRequired
};

Suggestion.SUGGESTIONS = [
    ['Why don\'t you head down to'],
    ['How about'],
    ['Umm', 'might be good']
];

Suggestion.TIMES = {
    morning: 'this morning',
    afternoon: 'this afternoon',
    evening: 'this evening',
    'now': 'now'
}

export default Suggestion;
