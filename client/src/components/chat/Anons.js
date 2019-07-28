import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllAnons } from '../../actions/chatActions';
import Spinner from '../common/Spinner';

import ShowAnons from './ShowAnons';

class Anons extends Component {
  componentDidMount() {
    this.props.getAllAnons();
  };

  render() {
    const { loadingAnons } = this.props.chat;
    return (
      <div className="container">
        {loadingAnons ? <Spinner /> : (
          <ShowAnons />
        )}
      </div>
    )
  }
}

Anons.propTypes = {
  getAllAnons: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllAnons })(withRouter(Anons));