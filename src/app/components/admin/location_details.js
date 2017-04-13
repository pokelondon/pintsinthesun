import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


class LocationDetails extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    onFormSubmit(e) {
        e.preventDefault();
    }

    saveLocation() {
        this.props.onSave();
    }

    render() {

        return (

            <form className="Location-details" onSubmit={this.onFormSubmit}>

                <div className="Box Box-row">
                    <div className="Box Box-item">
                        <h2 className="Heading--1">{this.props.name}</h2>
                    </div>
                </div>
                <div className="Box Box-row flex-wrap">
                    <div className="Box Box-item Box-item--noPadding Property-option">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="hasOutsideSpace" value="true" checked={this.props.hasOutsideSpace} /> Outside space
                        </label>
                    </div>
                    <div className="Box Box-item Box-item--noPadding Property-option">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="hasGarden" value="true" checked={this.props.hasGarden} /> Garden
                        </label>
                    </div>
                </div>
                <div className="Box Box-row">

                    {this.props.onCancel &&
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.props.onCancel} className="Button--secondary">Cancel</button>
                    </div>}

                    {this.props.onSave &&
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.props.onSave} className="Button--secondary">Save</button>
                    </div>}

                </div>

            </form>


        );
    }
}

LocationDetails.propTypes = {
    name: PropTypes.string.isRequired,
    onFormChange: PropTypes.func.isRequired,
    hasOutsideSpace: PropTypes.bool,
    hasGarden: PropTypes.bool
}

export default LocationDetails;
