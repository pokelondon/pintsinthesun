import React from 'react';

const PubSearchResult = (props) => {
    return (
        <div
            className={props.cssClasses}
            onMouseOver={() => props.onRollover(props.index)}
            onClick={() => props.onClick(props.placeID)}
        >{props.description}</div>
    )
}

PubSearchResult.propTypes = {
    cssClasses: React.PropTypes.string.isRequired,
    onRollover: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    placeID: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
};

PubSearchResult.defaultProps = {
};

export default PubSearchResult;