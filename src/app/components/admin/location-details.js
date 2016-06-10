import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


export default class MyComponent extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            hasTerrace: false,
            buildingToTheWest: false,
            isSaved: false
        };
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

        return (

            <form onSubmit={this.onFormSubmit}>
                <h2 className="Heading--1">{this.props.location.name}</h2>

                <div className="Box Box-row">

                    <div className="Box Box-item">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="has_terrace" value="true" checked={this.props.hasTerrace} /> Has outdoor terrace?
                        </label>
                    </div>

                    <div className="Box Box-item">
                        <label>
                            <input onChange={this.props.onFormChange} type="checkbox" name="building_to_the_west" value="true" checked={this.props.buildingToTheWest} /> Has building to the west?
                        </label>
                    </div>

                    <div className="Box Box-item no-padding">
                        <button onClick={this.saveLocation.bind(this)} className={btnClasses}>Save</button>
                    </div>

                </div>

                <div className="Box Box-row">
                    <div className="Box Box-item no-padding">
                        <button onClick={this.props.onNextLocation} className="Button--primary">Choose another pub</button>
                    </div>
                </div>

            </form>
        );
    }
}
