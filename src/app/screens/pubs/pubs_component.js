import React from 'react';

import Slider from 'rc-slider';
import { Link } from 'react-router'

import PubDetail from '../pubdetail/pubdetail_container';


class Pubs extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    onSliderChange(value) {
        var current = this.props.date;
        this.props.updateTime(new Date(current.setHours(value)));
    }

    render() {
        return (
            <div>
                <p>Sunny: {this.props.filteredPubs.length}/{this.props.items.length} Nearby</p>
                <Slider
                    min={6}
                    max={21}
                    step={1}
                    included={false}
                    defaultValue={this.props.date.getHours()}
                    className='Slider'
                    onChange={this.onSliderChange.bind(this)}
                />
                <PubDetail />
                <button className="Button--primary" onClick={this.props.incrementCurrentPub}>Next</button>
            </div>
        )
    }
}

Pubs.propTypes = {
    items: React.PropTypes.array.isRequired,
    filteredPubs: React.PropTypes.array.isRequired,
    updateTime: React.PropTypes.func.isRequired,
    date: React.PropTypes.instanceOf(Date).isRequired,
    incrementCurrentPub: React.PropTypes.func
}

export default Pubs;

