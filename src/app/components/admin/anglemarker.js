import React from 'react';

class AngleMarker extends React.Component {


    constructor(props) {
        super(props)
        this.props = props;

        this.startDragPos;

        this.state = {
            isDragging: false
        }
    }


    render() {

        let mouseCover;
        if(this.state.isDragging){
            mouseCover = <div
                onMouseUp={this.onMouseUp.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                className="MouseCover">
            </div>
        }

        return (
            <div>
                {mouseCover}
                <div
                    className="Marker"
                    onMouseDown={this.onMouseDown.bind(this)}
                    >
                    <span className="Marker-text">{this.props.angle.toFixed(2)}</span>
                    <div className="Marker-angle" style={{transform: `rotate(${this.props.angle}deg)`}}></div>
                </div>
            </div>
        );
    }

    onMouseDown(e) {
        this.startDragPos = e.pageX;
        this.setState({isDragging: true});
    }

    onMouseUp() {
        this.setState({isDragging: false});
    }

    onMouseMove(e) {
        let pxOffset = this.startDragPos - e.pageX;
        let angle = pxOffset / 2;
        if(angle >= 150) angle = 150;
        if(angle <= -150) angle = -150;
        this.props.onAngleChage(angle);
    }

}

AngleMarker.propTypes = {
    angle: React.PropTypes.number.isRequired,
}

export default AngleMarker;
