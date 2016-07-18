import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

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

    componentDidUpdate(prevProps) {
        if(prevProps.name !== this.props.name) {
            this.animateCanvasOut();
        }
    }

    animateCanvasOut() {
        this.setState({renderTransitionDirection: this.props.renderTransitionDirection});
        setTimeout(this.animateCanvasIn.bind(this), 150);
    }

    animateCanvasIn() {
        if(this.state.renderTransitionDirection){
            let newAnimation = this.state.renderTransitionDirection.replace('out', 'in');
            this.setState({renderTransitionDirection: newAnimation});
        }
    }


    getSuggestionText() {
        return Suggestion.SUGGESTIONS[parseInt(Suggestion.SUGGESTIONS.length * Math.random())];
    }

    render() {

        let renderClasses = classnames({
            'js-suggestion-name': true,
            'Heading--1': true,
            'inner': true,
            'Render--transition-left-out': (this.state.renderTransitionDirection === 'left-out'),
            'Render--transition-left-in': (this.state.renderTransitionDirection === 'left-in'),
            'Render--transition-right-out': (this.state.renderTransitionDirection === 'right-out'),
            'Render--transition-right-in': (this.state.renderTransitionDirection === 'right-in'),
        });
        {renderClasses}

        let [ first, last ] = this.state.suggestion;
        //last = (last) ? ' ' + last : '?';
        return (
            <div className="Box Box-row">
                <div className="Box Box-item Suggestion">
                    <span className={renderClasses}>
                        <span className="">{first} </span>
                        <span className="txt-suggestion">{this.props.name}</span>
                        <span className=""> {last} {Suggestion.TIMES[this.props.timeRange]}?</span>
                    </span>
                </div>
            </div>
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
