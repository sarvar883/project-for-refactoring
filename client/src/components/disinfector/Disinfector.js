import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrders } from '../../actions/orderActions';
import Spinner from '../common/Spinner';
import DisplayOrders from './DisplayOrders';

class Disinfector extends Component {
  componentDidMount() {
    this.props.getOrders(this.props.auth.user.id);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Страница Дезинфектора {this.props.auth.user.name}</h1>
            <h2 className="text-center mt-3">Ваши Заказы</h2>
          </div>
        </div>

        {this.props.order.loading ? <Spinner /> : (
          <div className="row">
            <DisplayOrders />
          </div>
        )}
      </div>
    );
  }
}

Disinfector.propTypes = {
  getOrders: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrders })(withRouter(Disinfector));