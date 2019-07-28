import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DisinfectorRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated === false) {
        return <Redirect to="/login" />
      }
      if (auth.user.occupation === 'disinfector') {
        return <Component {...props} />
      } else {
        return <Redirect to="/" />
      }
    }}
  />
);

DisinfectorRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(DisinfectorRoute);