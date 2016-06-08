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
            'container': true,
            'is-visible': this.props.isOpen
        });

        return (
            <div className={classes}>
                <div className="inner max-width">
                    {this.props.pulldownMenu === 'locationMenu' ? <LocateContainer onClose={this.props.onClose} /> : null}
                </div>
            </div>
        )
    }

}
