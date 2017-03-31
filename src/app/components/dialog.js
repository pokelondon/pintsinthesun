import React from 'react';

export default class Dialog extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        return (
            <div className="Dialog">
                <div className="Dialog-inner Box Box-row">
                    <div className="Box Box-item">
                        <p>{this.props.message}</p>
                        <button className="Button--anchor" onClick={this.props.onButtonClick}>{this.props.buttonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}