import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import * as positionActions from '../../actions/position';

import Header from './header_component';


const mapStateToProps = (state, ownProps) => {
    const { date } = state.position;

    return {
        date
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const HeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

export default HeaderContainer;

