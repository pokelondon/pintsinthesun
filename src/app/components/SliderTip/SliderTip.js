import React from 'react';

const SliderTip = (props) => {
    const currentHour = props.date.getHours();
    //The percentage of the current hour along the slider length, (7:00 to 21:00)
    //with 5px margin on left and right
    const position = ((currentHour - 7) / (21 - 7)) * 90 + 5;
    return(
        <div className="SliderTip">
            <span className="SliderTip-copy">Drag the slider to see how the shadows move through the day</span>
            <span style={{left: `${position}%`}} className="SliderTip-pointer"></span>
        </div>
    )
}

SliderTip.propTypes = {
    date: React.PropTypes.instanceOf(Date).isRequired
}

export default SliderTip;