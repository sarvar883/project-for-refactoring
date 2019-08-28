import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Materials extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(Materials));