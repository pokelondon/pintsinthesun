import React from 'react';
import { getUnapprovedPubs, updatePub } from '../../services/pintsinthesun';
import Map from '../../components/Map/Map';
import AngleMarker from '../../components/admin/anglemarker';
import ApprovePub from '../../components/admin/approve_pub';

export default class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
        this.refreshPubList();
    }

    refreshPubList() {
        getUnapprovedPubs().then((results) => {
            return results.json();
        })
        .then( (pubs) => {
            this.setState({pubs: pubs});
        })
        .catch( (err) => {
            this.props.showDialog('Something went wrong :(');
        });
    }


    getPubList() {
        if(!this.state.pubs){
            return null;
        }

        return this.state.pubs.map( (pub) => {
            return(
                <ApprovePub
                    pub={pub}
                    key={pub._id}
                    onApproved={this.refreshPubList.bind(this)}
                /> )
        });
    }

    render() {
        return (
            <div className="Screen Admin-tool">

                <header className="Screen-header">
                    <div className="max-width">
                        <h1>Admin</h1>
                    </div>
                </header>

                <div className="Screen-main max-width">
                    {this.getPubList()}
                </div>

            </div>
        )
    }
}