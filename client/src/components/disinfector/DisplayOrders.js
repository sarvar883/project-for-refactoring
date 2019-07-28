import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrders, addDisinfectorComment } from '../../actions/orderActions';
import OrderInfo from './OrderInfo';

// socket.io
import openSocket from 'socket.io-client';

class DisplayOrders extends Component {
  _isMounted = false;

  state = {
    orders: this.props.order.orders.data
  };

  componentDidMount() {
    this._isMounted = true;

    const socket = openSocket('http://localhost:5000');
    socket.on('createOrder', data => {
      console.log('createOrder', data.order);
      if (this.props.auth.user.id === data.disinfectorId) {
        this.addOrder(data.order);
      }
    })
  }

  addOrder = (order) => {
    this.setState(prevState => {
      const updatedOrders = [...prevState.orders];
      updatedOrders.push(order);
      return {
        orders: updatedOrders
      };
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { orders } = this.state
    let output = null;

    if (orders) {
      output = (
        <React.Fragment>
          {orders.map((item, index) =>
            <OrderInfo orderObject={item} index={index} key={index} />
          )}
        </React.Fragment>
      )
    }
    return (
      output
    )
  }
}

DisplayOrders.propTypes = {
  getOrders: PropTypes.func.isRequired,
  addDisinfectorComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrders, addDisinfectorComment })(withRouter(DisplayOrders));