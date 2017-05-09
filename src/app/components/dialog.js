import React from 'react';

const Dialog = ({message, buttonText, onButtonClick}) => {
    return (
        <div className="Dialog">
            <div className="Dialog-inner Box Box-row">
                <div className="Box Box-item">
                    <p>{message}</p>
                    <button className="Button--anchor" onClick={onButtonClick}>{buttonText}</button>
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