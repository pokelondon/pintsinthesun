import React from 'react';

class AngleMarker extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
    }

    render() {
        return (
            <div
                className="Marker"
                >
                <span className="Marker-text">{this.props.angle.toFixed(2)}</span>
                <div className="Marker-angle" style={{transform: `rotate(${this.props.angle}deg)`}}></div>
            </div>
        );
    }

}

AngleMarker.propTypes = {
    angle: React.PropTypes.number.isRequired,
}

export default AngleMarker;
