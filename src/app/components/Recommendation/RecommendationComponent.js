import React from 'react';
import LocationAttributes from '../LocationAttributes';

class RecommendationComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasOutsideSpace: false,
            hasGarden: false,
        }
        this.onAttributeChange = this.onAttributeChange.bind(this);
        this.recommendPub = this.recommendPub.bind(this);
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

    getContent() {
        //check if this pub is in the list of recommended pubs already
        const hasBeenRecommended = this.props.alreadyRecommended.find((recommendation) => {
            return recommendation === this.props.pub.foursquareID;
        });

        if(hasBeenRecommended) {
            return (
                <div>Thanks for the recommendation!</div>
            )
        }

        return (
            <div>
                <p className="Para--large">Have you been here?</p>
                <p className="Para--body">Let us know if this pub is worth visiting on a sunny day...</p>

                <LocationAttributes
                    hasOutsideSpace={this.state.hasOutsideSpace}
                    hasGarden={this.state.hasGarden}
                    onSave={this.recommendPub}
                    onFormChange={this.onAttributeChange}
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

