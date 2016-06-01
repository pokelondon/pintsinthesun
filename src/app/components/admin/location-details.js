import React, { Component, PropTypes } from 'react';



export default class MyComponent extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            hasTerrace: false,
            buildingToTheWest: false
        };
    }

    // onTerraceChange(e) {
    //     this.setState({hasTerrace: e.target.checked});
    // }
    //
    // onBuildingToTheWestChange(e) {
    //     this.setState({buildingToTheWest: e.target.checked});
    // }


    onFormSubmit(e) {
        e.preventDefault();
    }

    render() {


        return (

            <form onSubmit={this.onFormSubmit}>

                <h1>{this.props.location.name}</h1>

                {this.props.angle} Angle <br />

                <div class="checkbox">
                    <label>
                        <input onChange={this.props.onFormChange} type="checkbox" name="has_terrace" value="true" checked={this.props.hasTerrace} /> Has outdoor terrace?
                    </label>
                </div>

                <div class="checkbox">
                    <label>
                        <input onChange={this.props.onFormChange} type="checkbox" name="building_to_the_west" value="true" checked={this.props.buildingToTheWest} /> Has building to the west?
                    </label>
                </div>

                <button onClick={this.props.onSave} className="btn btn-primary">Save</button>

                <button onClick={this.props.onNextLocation} className="btn btn-primary">Next</button>


            </form>
        );
    }
}
