import React from 'react';
import LocateScreen from '../locate/locate_container';
import InfoScreen from '../info/info_component';
import classNames from 'classnames';

export default class Pulldown extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let isVisible = this.props.pulldownMenu ? true : false;
        let classes = classNames({
            'PulldownMenu': true,
            'container': true,
            'is-visible': isVisible
        });

        return (
            <div className={classes}>
                <div className="inner max-width">
                    {this.props.pulldownMenu === 'location' ? <LocateScreen onClose={this.props.onClose} /> : null}
                    {this.props.pulldownMenu === 'info' ? <InfoScreen /> : null}
                </div>
            </div>
        )
    }

}
