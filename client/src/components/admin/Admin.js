import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Admin extends Component {
  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <h2 className="m-auto">Страница Админа {this.props.auth.user.name}</h2>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(Admin));