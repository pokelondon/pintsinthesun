import React from 'react';
import LocationAttributes from '../LocationAttributes';

const sentences = {};

sentences.INTRO = [
    ['Hmm, we dont know much about', '...'],
    ['No-one has recommended', 'yet...'],
    ['Hmm, we arent sure if', 'is any good yet...'],
];

sentences.RECOMMEND = [
    ['Can you recommend it as a good place for sunny pint?'],
    ['Have you been? Would you recommend it for al fresco drinking?'],
    ['Been here before? Let us know if its any good for a sunny drink!'],
];

class RecommendationComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasOutsideSpace: false,
            hasGarden: false,
            introSentences: this.getRandomSentences('INTRO'),
            recommendSentences: this.getRandomSentences('RECOMMEND'),
        }
        this.onAttributeChange = this.onAttributeChange.bind(this);
        this.recommendPub = this.recommendPub.bind(this);
    }

    componentwillReceiveProps(nextProps) {
        if(this.props.pub.name !== nextProps.pub.name) {
            this.setState({
                introSentences: this.getRandomSentences('INTRO'),
                recommendSentences: this.getRandomSentences('RECOMMEND'),
            });
        }
    }

    onAttributeChange(e) {
        let checkBox = e.target;
        let newState = {...this.state};
        newState[checkBox.name] = checkBox.checked;
        this.setState(newState);
    }

    recommendPub(e) {
        const attributes = {
            hasOutsideSpace: this.state.hasOutsideSpace,
            hasGarden: this.state.hasGarden
        }
        this.props.recommendPub(attributes);
    }

    getRandomSentences(key) {
        const randomSentences = sentences[key];
        return randomSentences[Math.floor(Math.random() * randomSentences.length)];
    }

    getContent() {
        //check if this pub is in the list of recommended pubs already
        const hasBeenRecommended = this.props.alreadyRecommended.find((recommendation) => {
            return recommendation === this.props.pub.foursquareID;
        });

        if(hasBeenRecommended) {
            return (
                <p className="Para--large">Thanks for the recommendation!</p>
            )
        }

        //const introSentences = INTRO_SENTENCES[Math.floor(Math.random() * INTRO_SENTENCES.length)];
        //const recommendSentence = RECOMMEND_SENTENCES[Math.floor(Math.random() * RECOMMEND_SENTENCES.length)];

        return (
            <div>
                <p className="Para--large">{this.state.introSentences[0]} <em>{this.props.pub.name}</em> {this.state.introSentences[1]}</p>
                <p className="Para--large">{this.state.recommendSentences[0]}</p>
                <p>Just tick all that apply, and let us know!</p>

                <LocationAttributes
                    hasOutsideSpace={this.state.hasOutsideSpace}
                    hasGarden={this.state.hasGarden}
                    onSave={this.recommendPub}
                    onFormChange={this.onAttributeChange}
                    saveLabel="Recommend it!"
                />
            </div>
        )
    }

    render() {
        return(
            <div className="Box Box-item Box-item--noPadding Box-item--halfCol Box-item--responsiveBorders">
                <div className="box-child-margin">
                    {this.getContent()}
                </div>
            </div>
        )
    }
}

export default RecommendationComponent;

