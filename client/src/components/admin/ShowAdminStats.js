import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowAdminStats extends Component {
  state = {
    orders: this.props.admin.stats.orders
  };

  render() {
    const { orders } = this.state;

    let totalSum = 0,
      cash = 0,
      totalScore = 0,
      allConsumptions = [],
      completedOrders = [],
      confirmedOrders = [],
      rejectedOders = [];

    orders.forEach(order => {
      if (order.completed) {
        completedOrders.push(order);

        if (order.operatorConfirmed && order.adminConfirmed) {
          confirmedOrders.push(order);
          totalSum += order.cost;
          if (order.paymentMethod === 'Наличный') cash++;
          order.consumption.forEach(element => allConsumptions.push(element));
          totalScore += order.score;
        }

        if (!order.operatorConfirmed || !order.adminConfirmed) {
          rejectedOders.push(order);
        }
      }
    });

    let notCash = orders.length - cash;
    const cashPercent = (cash * 100 / orders.length).toFixed(1);
    const notCashPercent = (100 - cashPercent).toFixed(1);

    let consumptionArrayResult = [];
    materials.forEach(object => consumptionArrayResult.push({
      material: object.material,
      amount: 0,
      unit: object.unit
    }));

    allConsumptions.forEach(item => {
      consumptionArrayResult.forEach(element => {
        if (element.material === item.material) {
          element.amount += item.amount;
          return;
        }
      })
    });

    let renderConsumption;
    renderConsumption = consumptionArrayResult.map((item, index) =>
      <li key={index}>{item.material}: {item.amount} {item.unit}</li>
    );

    let renderConfirmedOrders = confirmedOrders.map((item, key) => {

      let renderConsumptionOfOrder = item.consumption.map((material, index) =>
        <li key={index}>{material.material} : {material.amount} {material.unit}</li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li className="pb-2">Клиент: {item.client}</li>
                <li className="pb-2">Телефон: {item.phone}</li>
                <li className="pb-2">Адрес: {item.address}</li>
                <li className="pb-2">Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                <li className="pb-2">Сумма: {item.cost.toLocaleString()} UZS</li>
                <li className="pb-2">Тип Платежа: {item.paymentMethod}</li>

                {item.paymentMethod === 'Безналичный' ? <li className="pb-2">Счет-Фактура: {item.invoice}</li> : ''}

                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {renderConsumptionOfOrder}
                </ul>
                <li className="pb-2">Балл: {item.score}</li>
                <li className="pb-2">Отзыв Клиента: {item.clientReview}</li>
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
                <h2 className="text-center">Заказы</h2>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {orders.length}</li>
                  <li>Выполнено Заказов: {completedOrders.length}</li>
                  <li>Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Тип Платежей:</li>
                  <ul className="font-bold mb-1">
                    <li>Наличный: {cash} ({cashPercent} %)</li>
                    <li>Безналичный: {notCash} ({notCashPercent} %)</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h2 className="text-center">Рейтинг:</h2>
                <ul className="font-bold mb-0 pl-3">
                  <li>Средний балл: {(totalScore / orders.length).toFixed(2)} (из 10)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h2 className="text-center">Расход Материалов:</h2>
                <ul className="font-bold mb-0 pl-3">
                  {renderConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Подтвержденные Заказы</h2>
          </div>
          {confirmedOrders.length > 0 ? (renderConfirmedOrders) : <h2>Нет подтвержденных заказов</h2>}
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

export default connect(mapStateToProps, {})(withRouter(ShowAdminStats));