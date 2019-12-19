import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowDisStats extends Component {
  state = {
    orders: this.props.admin.stats.orders,
    acceptedOrders: this.props.admin.stats.acceptedOrders
  };





  renderOrders = (orders) => {
    return orders.map((order, key) => {
      // consumption array of specific order
      let consumptionArray = [];

      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let renderOrderConsumption = consumptionArray.map((object, number) =>
        <li key={number}>
          <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
          {object.consumption.map((element, number) =>
            <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
          )}
        </li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>

                {order.repeatedOrder ? (
                  <React.Fragment>
                    <li>Это повторный заказ</li>
                    {order.repeatedOrderDecided ? (
                      <React.Fragment>
                        <li>Решение по проведению повторной работы принята</li>
                        {order.repeatedOrderNeeded ? <li>Повторная Работа требуется</li> : <li>Повторная Работа Не требуется</li>}
                      </React.Fragment>
                    ) : <li>Решение по проведению повторной заявки еще не принята</li>}
                  </React.Fragment>
                ) : ''}

                {order.completed ? <li>Заказ выполнен</li> : <li>Заказ еще не выполнен</li>}

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

                {order.completed ? (
                  <React.Fragment>
                    <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                  </React.Fragment>
                ) : ''}

                {!order.completed && order.repeatedOrder && order.repeatedOrderDecided && order.repeatedOrderNeeded ? (
                  <React.Fragment>
                    <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                  </React.Fragment>
                ) : ''}

                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>

                {order.completed ?
                  <React.Fragment>
                    <li>Срок гарантии (в месяцах): {order.guarantee}</li>
                    <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                    <ul className="font-bold mb-0">
                      {renderOrderConsumption}
                    </ul>
                  </React.Fragment>
                  : ''}

                {order.completed && order.clientType === 'corporate' ? (
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


                {order.completed && order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                {order.userAcceptedOrder ? (
                  <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                ) : ''}

                <li>Заказ добавил: {order.userCreated.occupation} {order.userCreated.name} (<Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment>)</li>

                {order.completed ?
                  <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li> : ''}
              </ul>
            </div>
          </div>
        </div>
      );
    });
  };





  render() {

    let totalSum = 0,
      totalScore = 0,
      totalSumOfAcceptedOrders = 0,
      totalConsumption = [],
      completedOrders = [],
      confirmedOrders = [],
      rejectedOrders = [];

    let corporateClientOrders = {
      sum: 0,
      orders: 0
    };

    let indivClientOrders = {
      sum: 0,
      orders: 0
    };

    materials.forEach(item => {
      const emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
      if (order.completed) {
        completedOrders.push(order);
      }

      if (order.clientType === 'corporate') {
        if (order.paymentMethod === 'cash') {
          if (order.operatorConfirmed && order.adminConfirmed) {
            confirmedOrders.push(order);
            totalSum += order.cost;
            totalScore += order.score;

            corporateClientOrders.orders++;
            corporateClientOrders.sum += order.cost;
          }

          if ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed)) {
            rejectedOrders.push(order);
          }
        }

        if (order.paymentMethod === 'notCash') {
          if (order.operatorConfirmed && order.accountantConfirmed) {
            confirmedOrders.push(order);
            totalSum += order.cost;
            totalScore += order.score;

            corporateClientOrders.orders++;
            corporateClientOrders.sum += order.cost;
          }
          if ((order.operatorDecided && !order.operatorConfirmed) || (order.accountantDecided && !order.accountantConfirmed)) {
            rejectedOrders.push(order);
          }
        }
      }




      if (order.clientType === 'individual') {
        if (order.completed && order.operatorConfirmed && order.adminConfirmed) {
          confirmedOrders.push(order);
          totalSum += order.cost / order.disinfectors.length;
          totalScore += order.score;

          indivClientOrders.orders++;
          indivClientOrders.sum += order.cost;
        }
        if (order.completed && ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed))) {
          rejectedOrders.push(order);
        }
      }

      // calculate total consumption of all orders of disinfector in given period
      order.disinfectors.forEach(element => {
        if (element.user._id.toString() === this.props.admin.stats.disinfectorId) {
          element.consumption.forEach(object => {
            totalConsumption.forEach(item => {
              if (object.material === item.material && object.unit === item.unit) {
                item.amount += object.amount;
              }
            });
          });
        }
      });
    });

    this.state.acceptedOrders.forEach(order => {

      if (order.clientType === 'corporate') {
        if (order.paymentMethod === 'cash') {
          if (order.operatorConfirmed && order.adminConfirmed) {
            totalSumOfAcceptedOrders += order.cost;
          }
        }

        if (order.paymentMethod === 'notCash') {
          if (order.operatorConfirmed && order.accountantConfirmed) {
            totalSumOfAcceptedOrders += order.cost;
          }
        }
      }

      if (order.clientType === 'individual') {
        if (order.completed && order.operatorConfirmed && order.adminConfirmed) {
          totalSumOfAcceptedOrders += order.cost;
        }
      }

    });

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    // let renderAllOrders = this.state
    let renderAllOrders = this.renderOrders(this.state.orders);

    let renderAcceptedOrders = this.renderOrders(this.state.acceptedOrders);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h2 className="text-center">Заказы</h2>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {this.state.orders.length}</li>
                  <li>Выполнено Заказов: {completedOrders.length}</li>
                  <li>Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Средний балл подтвержденных заказов: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                  <li>Отвергнуто Заказов: {rejectedOrders.length}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 pl-3">
                  <li>Пользователь принял заказов: {this.state.acceptedOrders.length}</li>
                  <li>Общая сумма принятых заказов: {totalSumOfAcceptedOrders.toLocaleString()} UZS</li>

                  <h4 className="text-center mt-2">Корпоративные клиенты</h4>
                  <li>Количество подтвержденных заказов: {corporateClientOrders.orders}</li>
                  <li>На общую сумму: {corporateClientOrders.sum.toLocaleString()} UZS</li>
                  <h4 className="text-center">Физические клиенты</h4>
                  <li>Количество подтвержденных заказов: {indivClientOrders.orders}</li>
                  <li>На общую сумму: {indivClientOrders.sum.toLocaleString()} UZS</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h2 className="text-center">Расход Материалов:</h2>
                <ul className="font-bold mb-0 pl-3">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Все Заказы Пользователя</h2>
          </div>
          {this.state.orders.length > 0 ? (renderAllOrders) : <h2>Нет заказов</h2>}
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Принятые Заказы Пользователя</h2>
          </div>
          {this.state.acceptedOrders.length > 0 ? (renderAcceptedOrders) : <h2>Нет заказов</h2>}
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

export default connect(mapStateToProps)(withRouter(ShowDisStats));