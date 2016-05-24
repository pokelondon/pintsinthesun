import React from 'react';

class AngleMarker extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.startVal = 0;
        this.lastVal = 0;
        this.mouseDown = false;
    }

    onMouseMove(evt) {
        evt.preventDefault();
        if(evt.buttons) {
            var x = this.startVal - evt.clientX;
            if (x > this.lastVal) {
                this.props.onIncrement();
            } else {
                this.props.onDecrement();
            }
            this.lastVal = x;
        }
    }

    render() {
        return (
            <div
                className="Marker"
                onMouseMove={this.onMouseMove.bind(this)}
                >
                <span className="Marker-text">{this.props.angle}</span>
                <div className="Marker-angle" style={{transform: `rotate(${this.props.angle}deg)`}}></div>
            </div>
        );
    }

}

AngleMarker.propTypes = {
    angle: React.PropTypes.number.isRequired,
    onIncrement: React.PropTypes.func.isRequired,
    onDecrement: React.PropTypes.func.isRequired
}

export default AngleMarker
