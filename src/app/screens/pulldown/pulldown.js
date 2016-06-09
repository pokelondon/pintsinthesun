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

        console.log('pulldown props', this.props);

        let classes = classNames({
            'PulldownMenu': true,
            'container': true,
            'is-visible': this.props.isOpen
        });

        return (
            <div className={classes}>
                <div className="inner max-width">
                    {this.props.pulldownMenu === 'locateMenu' ? <LocateScreen onClose={this.props.onClose} /> : null}
                    {this.props.pulldownMenu === 'info' ? <InfoScreen onClose={this.props.onClose} /> : null}
                </div>
            </div>
        )
    }

}
