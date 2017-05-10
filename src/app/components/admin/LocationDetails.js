import React from 'react';
import classnames from 'classnames';

const LocationDetails = (props) => {

    return (
        <form className="LocationDetails" onSubmit={ (e) => e.preventDefault()}>
            <div className="Box Box-row">
                <div className="Box Box-item">
                    <h2 className="Heading--1">{props.name}</h2>
                </div>
            </div>
            <div className="Box Box-row flex-wrap">
                <div className="Box Box-item Box-item--noPadding">
                    <label>
                        <input onChange={props.onFormChange} type="checkbox" name="hasOutsideSpace" value="true" checked={props.hasOutsideSpace} /> Outside space
                    </label>
                </div>
                <div className="Box Box-item Box-item--noPadding">
                    <label>
                        <input onChange={props.onFormChange} type="checkbox" name="hasGarden" value="true" checked={props.hasGarden} /> Garden
                    </label>
                </div>
            </div>
            <div className="Box Box-row">

                {props.onCancel &&
                <div className="Box Box-item Box-item--noPadding">
                    <button onClick={props.onCancel} className="Button--secondary">{props.cancelLabel}</button>
                </div>}

                {props.onSave &&
                <div className="Box Box-item Box-item--noPadding">
                    <button onClick={props.onSave} className="Button--secondary">{props.saveLabel}</button>
                </div>}

            </div>

        </form>
    )
}

LocationDetails.propTypes = {
    name: React.PropTypes.string.isRequired,
    onFormChange: React.PropTypes.func.isRequired,
    hasOutsideSpace: React.PropTypes.bool,
    hasGarden: React.PropTypes.bool,
    saveLabel: React.PropTypes.string,
    cancelLabel: React.PropTypes.string,
}

LocationDetails.defaultProps = {
    saveLabel: 'Save',
    cancelLabel: 'Cancel',
}

export default LocationDetails;
