import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { adminConfirmsOrderQuery } from '../../actions/adminActions';

class ShowQueriesForAdmin extends Component {
  _isMounted = false;

  state = {
    orderQueries: this.props.admin.orderQueries
  };

  componentDidMount() {
    this._isMounted = true;
  }

  adminConfirmsOrderQuery = (orderId, response) => {
    const object = {
      orderId: orderId,
      response: response
    };
    this.props.adminConfirmsOrderQuery(object, this.props.history);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let orderQueries = this.state.orderQueries.map((order, index) => {
      let renderConsumptionOfOrder = order.consumption.map((material, index) =>
        <li key={index}>{material.material} : {material.amount} {material.unit}</li>
      );
      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-3">
                <li>Дезинфектор: {order.disinfectorId.name}</li>
                <li>Клиент: {order.client}</li>
                <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Откуда узнали: {order.advertising}</li>
                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
                <li>Срок гарантии (в месяцах): {order.guarantee}</li>
                <li>Сумма: {order.cost.toLocaleString()} UZS</li>

                <li>Тип Платежа: {order.paymentMethod}</li>

                {order.paymentMethod === 'Безналичный' ? <li>Счет-Фактура: {order.invoice}</li> : ''}

                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {renderConsumptionOfOrder}
                </ul>
                <li>Оператор: {order.userCreated.name}</li>
                <li>Оператор Рассмотрел Заказ? {order.operatorDecided ? 'Да' : 'Еще Нет'}</li>
                {order.operatorDecided ? <li className="pb-2">Оператор Подтвердил? {order.operatorConfirmed ? 'Да' : 'Нет'}</li> : ''}
              </ul>

              <div className="btn-group">
                <button className="btn btn-danger mr-2" onClick={this.adminConfirmsOrderQuery.bind(this, order._id, false)}>Отменить</button>
                <button className="btn btn-success" onClick={this.adminConfirmsOrderQuery.bind(this, order._id, true)}>Подтвердить</button>
              </div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Выполненные Заказы</h1>
          </div>
          {orderQueries}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { adminConfirmsOrderQuery })(withRouter(ShowQueriesForAdmin));