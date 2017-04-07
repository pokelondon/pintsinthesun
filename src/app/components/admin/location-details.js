import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


export default class LocationDetails extends Component {

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

        let btnClasses = classNames({
            'Button--secondary': true
        });

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
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.props.onCancel} className={btnClasses}>Cancel</button>
                    </div>
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.props.onSave} className={btnClasses}>Save</button>
                    </div>
                </div>

            </form>


        );
    }
}
