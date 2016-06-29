import React from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

export default class LocationIndicator extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div>Location</div>
        )
    } 
}
