import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowOperStats extends Component {
  state = {
    orders: this.props.admin.stats.orders
  };

  render() {
    const { orders } = this.state;
    let totalSum = 0,
      totalScore = 0,
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

    materials.forEach(object => {
      const emptyObject = {
        material: object.material,
        amount: 0,
        unit: object.unit
      };
      totalConsumption.push(emptyObject);
    });

    orders.forEach(order => {
      if (order.completed) {
        completedOrders.push(order);

        if (order.clientType === 'corporate') {
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

        if (order.clientType === 'individual') {
          if (order.operatorConfirmed && order.adminConfirmed) {
            confirmedOrders.push(order);
            totalSum += order.cost;
            totalScore += order.score;

            indivClientOrders.orders++;
            indivClientOrders.sum += order.cost;
          }
          if ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed)) {
            rejectedOrders.push(order);
          }
        }

        // calculate total consumption of all orders in given period
        order.disinfectors.forEach(element => {
          element.consumption.forEach(object => {
            totalConsumption.forEach(item => {
              if (object.material === item.material && object.unit === item.unit) {
                item.amount += object.amount;
              }
            });
          });
        });
      }
    });

    let renderTotalConsumption = totalConsumption.map((element, key) =>
      <li key={key}>{element.material}: {element.amount.toLocaleString()} {element.unit}</li>
    );

    let renderOrders = orders.map((item, key) => {

      // consumption array of specific order
      let consumptionArray = [];

      item.disinfectors.forEach(thing => {
        consumptionArray.push({
          user: thing.user,
          consumption: thing.consumption
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
                <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>

                {item.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {item.operatorConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>
                        <li>Балл (0-5): {item.score}</li>
                        <li>Отзыв Клиента: {item.clientReview ? item.clientReview : 'Нет Отзыва'}</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : <li>Оператор еще не рассмотрел заявку</li>}

                {item.clientType === 'corporate' && !item.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                {item.clientType === 'corporate' && item.accountantDecided ?
                  <React.Fragment>
                    <li>Бухгалтер рассмотрел заявку</li>
                    {item.accountantConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>
                        <li>Счет-Фактура: {item.invoice}</li>
                        <li>Общая Сумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                  : ''}

                {item.clientType === 'individual' && !item.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}
                {item.clientType === 'individual' && item.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {item.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                    ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : ''}

                {item.clientType === 'corporate' ?
                  <React.Fragment>
                    <li>Корпоративный Клиент: {item.clientId.name}</li>
                    <li>Имя клиента: {item.client}</li>
                  </React.Fragment>
                  : ''}

                {item.clientType === 'individual' ?
                  <li>Физический Клиент: {item.client}</li>
                  : ''}

                <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                {item.completed ? (
                  <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                ) : (
                    <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment></li>
                  )}
                <li>Адрес: {item.address}</li>
                <li>Тип услуги: {item.typeOfService}</li>
                <li>Комментарии Оператора: {item.comment ? item.comment : 'Нет комментариев'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : 'Нет комментариев'}</li>
                {item.completed ? (
                  <React.Fragment>
                    <li>Срок гарантии (в месяцах): {item.guarantee}</li>

                    <li>Расход Материалов (заказ выполнили {item.disinfectors.length} чел):</li>
                    <ul className="font-bold mb-0">
                      {renderOrderConsumption}
                    </ul>
                  </React.Fragment>
                ) : ''}

                {item.completed && item.clientType === 'corporate' ?
                  <li>Номер Договора: {item.contractNumber}</li>
                  : ''}

                {item.completed && item.clientType === 'individual' ?
                  <li>Общая Сумма: {item.cost.toLocaleString()} UZS, (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                <li>Заказ принял: {item.userAcceptedOrder.occupation} {item.userAcceptedOrder.name}</li>
                <li>Заказ добавил: {item.userCreated.occupation} {item.userCreated.name} (<Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment>)</li>

                {item.completed ? <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{item.completedAt}</Moment></li> : ''}

              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Оператор принял Заказов: {orders.length}</li>
                  <li>Выполнено Заказов: {completedOrders.length}</li>
                  <li>Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Средний балл подтвержденных заказов: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">На этих заказах расходовано материалов:</h4>
                <ul className="font-bold mb-0 pl-3">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 pl-3">
                  <h4 className="text-center">Корпоративные клиенты</h4>
                  <li>Количество подтвержденных заказов: {corporateClientOrders.orders}</li>
                  <li>На общую сумму: {corporateClientOrders.sum.toLocaleString()} UZS</li>
                  <h4 className="text-center">Физические клиенты</h4>
                  <li>Количество подтвержденных заказов: {indivClientOrders.orders}</li>
                  <li>На общую сумму: {indivClientOrders.sum.toLocaleString()} UZS</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Заказы, которые принял Оператора</h2>
          </div>
          {orders.length > 0 ? (renderOrders) : <h2>Нет заказов</h2>}
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

export default connect(mapStateToProps)(withRouter(ShowOperStats));