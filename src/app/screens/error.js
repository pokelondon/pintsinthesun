import React from 'react';

class FatalError extends React.Component {

    render() {
        return (
            <div className="Screen-header">
                <div className="max-width">
                    <p className="Heading--1">Oops</p>
                    <div className="Box Box-row">
                        <p>Something went wrong.</p>
                    </div>
                </div>
            </div>
        )
    }
}

FatalError.propTypes = {
}

export default FatalError;
