import React from 'react';

const Dialog = (props) => {
    return (
        <div className="Dialog">
            <div className="Dialog-inner Box Box-row">
                <div className="Box Box-item">
                    <p>{props.message}</p>
                    <button className="Button--anchor" onClick={props.onButtonClick}>{props.buttonText}</button>
                </div>
            </div>
        </div>
    )
}

Dialog.propTypes = {
    message: React.PropTypes.string,
    buttonText: React.PropTypes.string,
    onButtonClick: React.PropTypes.func
}

export default Dialog;