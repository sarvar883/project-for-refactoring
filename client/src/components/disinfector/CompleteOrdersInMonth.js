import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class CompleteOrdersInMonth extends Component {
  state = {
    orders: this.props.order.completeOrdersInMonth
  };

  render() {
    let completeOrders = this.state.orders.map((order, index) => {

      let consumptionArray = [];
      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let consumptionRender = consumptionArray.map((item, index) =>
        <li key={index}>
          <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
          {item.consumption.map((element, number) =>
            <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
          )}
        </li>
      );

      return (
        <div className="col-md-6 mt-3" key={index}>
          <div className="card order">
            <div className="card-body p-0">
              <ul className="font-bold mb-0">

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


                {order.clientType === 'corporate' && !order.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                {order.clientType === 'corporate' && order.accountantDecided ?
                  <React.Fragment>
                    <li>Бухгалтер рассмотрел заявку</li>
                    {order.accountantConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                        <li>Счет-Фактура: {order.invoice}</li>
                        <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                  : ''}

                {order.clientType === 'individual' && !order.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}
                {order.clientType === 'individual' && order.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {order.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                    ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'corporate' ?
                  <React.Fragment>
                    <li>Корпоративный Клиент: {order.clientId.name}</li>
                    <li>Имя клиента: {order.client}</li>
                  </React.Fragment>
                  : ''}

                {order.clientType === 'individual' ?
                  <li>Физический Клиент: {order.client}</li>
                  : ''}

                <li>Телефон Клиента: {order.phone}</li>
                {order.phone2 ? <li>Другой номер: {order.phone2}</li> : ''}
                <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>

                <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>

                {order.clientType === 'corporate' ?
                  <li>Номер Договора: {order.contractNumber}</li>
                  : ''}

                {order.clientType === 'individual' ?
                  <React.Fragment>
                    <li>Общая Цена: {order.cost.toLocaleString()} Сум</li>
                    <li>Из них Вам досталось: {parseFloat((order.cost / order.disinfectors.length).toFixed(2)).toLocaleString()} Сум</li>
                  </React.Fragment>
                  : ''}

                <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                <li>Заказ добавил: {order.userCreated.occupation} {order.userCreated.name}</li>
                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="row m-0">
        {completeOrders}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(CompleteOrdersInMonth));