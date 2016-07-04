import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


export default class MyComponent extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        // this.state = {
        //     hasTerrace: false,
        //     buildingToTheWest: false,
        //     isSaved: false
        // };
    }


    onFormSubmit(e) {
        e.preventDefault();
    }

    saveLocation() {
        this.props.onSave();
    }

    render() {

        let btnClasses = classNames({
            'Button--secondary': true,
            'Button--confirmed': this.props.isSaved
        });

        let uiBlocker;

        if(this.props.location.name === ''){
            uiBlocker = <div className="UI-blocker"></div>
        }

        return (

            <form className="Location-details" onSubmit={this.onFormSubmit}>


                <div className="Box Box-row">
                    <div className="Box Box-item">
                        <h2 className="Heading--1">{this.props.location.name}</h2>
                    </div>
                </div>
                <div className="Box Box-row flex-wrap">

                    <div className="Box Box-item Property-option no-padding Property-option">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="hasGarden" value="true" checked={this.props.hasGarden} /> Garden
                        </label>
                    </div>

                    <div className="Box Box-item Property-option no-padding">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="hasTerrace" value="true" checked={this.props.hasTerrace} /> Terrace
                        </label>
                    </div>

                    <div className="Box Box-item Property-option no-padding">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="isInPark" value="true" checked={this.props.isInPark} /> In a park
                        </label>
                    </div>
                </div>
                <div className="Box Box-row flex-wrap">

                    <div className="Box Box-item Property-option no-padding">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="isOnHill" value="true" checked={this.props.isOnHill} /> On a hill
                        </label>
                    </div>

                    <div className="Box Box-item Property-option no-padding">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="isIsolated" value="true" checked={this.props.isIsolated} /> Isolated
                        </label>
                    </div>

                    <div className="Box Box-item Property-option no-padding">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="buildingToTheWest" value="true" checked={this.props.buildingToTheWest} /> Building to the west
                        </label>
                    </div>
                </div>

                <div className="Box Box-row">
                    <div className="Box Box-item Box-item--noPadding">
                        <button onClick={this.saveLocation.bind(this)} className={btnClasses}>Save</button>
                    </div>

                </div>

                {uiBlocker}
            </form>


        );
    }
}
