import React from 'react';
import { Link } from 'react-router'

class Pub extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Pub">
                <h2>The Owl & Pussycat</h2>
                <div className="Render">render</div>
                <p>Lorem ipsum</p>
                {this.props.params.pubId}
            </div>
        )
    }
}

Pub.propTypes = {
}

export default Pub;
