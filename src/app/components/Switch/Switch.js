import React from 'react';
import classnames from 'classnames';

class Switch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: this.props.defaultValue || 0
        }
        this.selectIndex = this.selectIndex.bind(this);
    }

    selectIndex(idx) {
        this.setState(idx);
        this.props.onSelect(idx);
    }

    render() {
        return (
            <div className="Switch">
                {
                    this.props.values.map((value, idx) => {
                        const cssClasses = classnames({
                            'Switch-value': true,
                            'Switch-value--selected': idx === this.state.selectedIndex
                        });
                        return (
                            <div onClick={this.selectIndex(idx)} className={cssClasses}>{value}</div>
                        )
                    });
                }
            </div>
        )
    }
}

Switch.propTypes = {
    values: React.PropTypes.array,
    defaultValue: React.PropTypes.number,
    onSelect: React.PropType.func
}

export default Switch;

