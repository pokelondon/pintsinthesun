import React from 'react';
import LocateContainer from '../locate/locate_container';
import classNames from 'classnames';

export default class Pulldown extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {

        let classes = classNames({
            'PulldownMenu': true,
            'is-visible': this.props.isOpen
        });

        return (
            <div className={classes}>
                <div>
                    <button onClick={this.props.onClose}>close</button>
                </div>
                {this.props.pulldownMenu === 'locationMenu' ? <LocateContainer /> : null}
            </div>
        )
    }

}
