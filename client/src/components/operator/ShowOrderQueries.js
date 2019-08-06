import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

// socket.io
import openSocket from 'socket.io-client';

class ShowOrderQueries extends Component {
  _isMounted = false;

  state = {
    completeOrders: this.props.operator.completeOrders
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');

    socket.on('submitCompleteOrder', data => {
      this.addOrderToDOM(data.completeOrder);
    });
  }

  addOrderToDOM = (order) => {
    if (this._isMounted) {
      this.setState(prevState => {
        let updatedOrders = [...prevState.completeOrders];
        updatedOrders.push(order);
        return {
          completeOrders: updatedOrders
        };
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let completeOrders = this.state.completeOrders.map((order, index) =>
      <div className="col-lg-4 col-md-6" key={index}>
        <div className="card order mt-2">
          <div className="card-body p-0">
            <ul className="font-bold mb-0">
              <li className="pb-2">Дезинфектор: {order.disinfectorId.name}</li>
              <li className="pb-2">Клиент: {order.orderId.client}</li>
              <li className="pb-2">Дата: <Moment format="DD/MM/YYYY">{order.orderId.dateFrom}</Moment></li>
              <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{order.orderId.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.orderId.dateTo}</Moment></li>
              <li className="pb-2">Адрес: {order.orderId.address}</li>
              <li className="pb-2">Тип услуги: {order.orderId.typeOfService}</li>
              <li className="pb-2">Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
              <li className="pb-2">Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
              <li className="pb-2">Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
            </ul>
            <Link to={`/order-confirm/${order._id}`} className="btn btn-dark">Форма Подтверждения</Link>
          </div>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Выполненные Заказы</h1>
          </div>
          {completeOrders}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowOrderQueries));