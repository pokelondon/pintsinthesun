import React from 'react';

import Slider from 'rc-slider';

import Pub from '../../components/pub';


class Pubs extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            index: 0
        }
    }

    componentDidMount() {
        this.props.fetchPubs(this.props.date, this.props.centre);
    }

    onSliderChange(value) {
        var current = this.props.date;
        this.props.updateTime(new Date(current.setHours(value)));
    }

    next(evt) {
        evt.preventDefault();
        if(this.props.items.length > 1) {
            let index = this.state.index + 1;
            if(this.state.index >= this.props.items.length -1) {
                index = 0
            }
            this.setState({index});
        }
    }

    render() {
        if(this.props.isFetching) {
            return (
                <div className="Pub">
                    <h2>Loading</h2>
                </div>
            )
        } else if(!this.props.items.length) {
            return (
                <div className="Pub">
                    <h2>Nothing</h2>
                </div>
            )
        } else {
            let item = this.props.items[this.state.index];
            return (
                <div>
                    <p>{this.props.items.length} Results {this.props.date.toString()}</p>
                    <Slider
                        min={8}
                        max={22}
                        step={1}
                        included={false}
                        defaultValue={this.props.date.getHours()}
                        className='Slider'
                        onChange={this.onSliderChange.bind(this)}
                    />
                    <Pub {...item} date={this.props.date} />
                    <button className="Button" onClick={this.next.bind(this)}>Nah</button>
                </div>
            )
        }
    }
}

Pubs.propTypes = {
    items: React.PropTypes.array,
    fetchPubs: React.PropTypes.func,
    updateTime: React.PropTypes.func,
    date: React.PropTypes.instanceOf(Date)
}

export default Pubs;

