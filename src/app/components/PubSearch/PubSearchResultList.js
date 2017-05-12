import React from 'react';

const PubSearchResultList = ({children}) => {
    return (
        <div className="Box-row Search-resultContainer">
            <div className="Box Box-row Search-resultList">
                <div className="Box-item Box-item--noPadding">{children}</div>
            </div>
        </div>
    )
}

PubSearchResultList.propTypes = {
    children: React.PropTypes.node
}

export default PubSearchResultList;