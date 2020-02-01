import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

// socket.io
import openSocket from 'socket.io-client';
import socketLink from '../common/socketLink';

class ShowOrderQueries extends Component {
  _isMounted = false;

  state = {
    completeOrders: this.props.operator.completeOrders
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    // const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');
    const socket = openSocket(socketLink);

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
            <ul className="font-bold mb-0 pl-3">
              {order.returnedBack ? (
                <li className="text-danger">Это возвращенный заказ</li>
              ) : ''}

              <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
              {order.clientType === 'corporate' ?
                <React.Fragment>
                  {order.clientId ? (
                    <li>Корпоративный Клиент: {order.clientId.name}</li>
                  ) : <li>Корпоративный Клиент</li>}
                  <li>Имя клиента: {order.client}</li>
                </React.Fragment>
                : ''}

              {order.clientType === 'individual' ?
                <li>Физический Клиент: {order.client}</li>
                : ''}

              <li>Телефон клиента: {order.phone}</li>
              {order.phone2 !== '' ? <li>Запасной номер: {order.phone2}</li> : ''}
              <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
              <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
              <li>Адрес: {order.address}</li>
              <li>Тип услуги: {order.typeOfService}</li>
              <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
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