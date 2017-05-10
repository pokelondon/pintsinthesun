import React from 'react';

const PubSuggestionConfirm = (props) => {
    return (
        <div>
            <div className="Box Box-row">
                <div className="Box Box-item">
                    <h2 className="Heading--1">Thanks!</h2>
                    <p>Thanks for suggesting a sunny pub</p>
                </div>
            </div>
            <div className="Box Box-row">
                <div className="Box Box-item Box-item--noPadding">
                    <button onClick={props.onAddAnother} className="Button--secondary">Add another</button>
                </div>
                <div className="Box Box-item Box-item--noPadding">
                    <button onClick={props.onCancel} className="Button--secondaryAlt">Cancel</button>
                </div>
            </div>
        </div>
    )
}

PubSuggestionConfirm.propTypes = {
    onAddAnother: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
}

export default PubSuggestionConfirm;
