import React from 'react';
import { connect } from 'react-redux'
import RecommendationComponent from './RecommendationComponent';
import * as recommendActions from '../../actions/recommend';

const mapStateToProps = (state, ownProps) => {
    return {
        alreadyRecommended: state.recommend.alreadyRecommended
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        recommendPub: (attributes) => {
            dispatch(recommendActions.recommendPub(ownProps.pub.foursquareID, attributes))
        }
    }
}

RecommendationComponent.propTypes = {
    pub: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationComponent);