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

      let consumptionArray = [];
      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let renderConsumptionOfOrder = consumptionArray.map((item, index) => {
        return (
          <li key={index}>
            <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
            {item.consumption.map((element, number) =>
              <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
            )}
          </li>
        );
      });

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-3">
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

                <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Откуда узнали: {order.advertising}</li>
                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
                <li>Срок гарантии (в месяцах): {order.guarantee}</li>

                <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {renderConsumptionOfOrder}
                </ul>

                {order.clientType === 'corporate' ? (
                  <React.Fragment>
                    {order.paymentMethod === 'cash' ? (
                      <React.Fragment>
                        <li>Тип Платежа: Наличный</li>
                        <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : (
                        <React.Fragment>
                          <li>Тип Платежа: Безналичный</li>
                          <li>Номер Договора: {order.contractNumber}</li>
                        </React.Fragment>
                      )}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} Сум (каждому по {(order.cost / order.disinfectors.length).toFixed(2).toLocaleString()} Сум)</li>
                  : ''}

                <li>Добавил Заказ: {order.userCreated.occupation} {order.userCreated.name}</li>

                {order.userAcceptedOrder ? (
                  <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                ) : ''}

                {order.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {order.operatorConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                        <li>Балл (0-5): {order.score}</li>
                        <li>Отзыв Клиента: {order.clientReview ? order.clientReview : 'Нет Отзыва'}</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : <li>Оператор еще не рассмотрел заявку</li>}
              </ul>

              <div className="btn-group">
                <button className="btn btn-danger mr-2" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.adminConfirmsOrderQuery(order._id, 'false') } }}>Отменить</button>
                <button className="btn btn-success mr-2" onClick={() => { if (window.confirm('Вы уверены подтвердить заказ?')) { this.adminConfirmsOrderQuery(order._id, 'true') } }}>Подтвердить</button>
                <button className="btn btn-dark" onClick={() => { if (window.confirm('Вы уверены отправить заказ обратно дезинфектору?')) { this.adminConfirmsOrderQuery(order._id, 'back') } }}>Обратно</button>
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