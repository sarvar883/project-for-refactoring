import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowDisinfStats extends Component {
  state = {
    orders: this.props.disinfector.stats.orders,
    addedMaterials: this.props.disinfector.stats.addedMaterials
  };

  render() {
    let operatorDecidedOrders = [],
      confirmedOrders = [],
      rejectedOders = [],
      totalScore = 0;

    this.state.orders.forEach(item => {
      if (item.completed && item.operatorDecided) {
        operatorDecidedOrders.push(item);

        if (item.operatorConfirmed && item.adminConfirmed) {
          confirmedOrders.push(item);
          totalScore += item.score;
        } else {
          rejectedOders.push(item);
        }
      }
    });

    let ordersNumber = this.state.orders.length;
    let totalSum = 0, cash = 0;

    let allConsumptions = [];

    confirmedOrders.forEach(item => {
      totalSum += item.cost;
      if (item.paymentMethod === 'Наличный') cash++;
      item.consumption.forEach(element => allConsumptions.push(element));
    });

    let notCash = confirmedOrders.length - cash;
    const cashPercent = (cash * 100 / confirmedOrders.length).toFixed(1);
    const notCashPercent = (100 - cashPercent).toFixed(1);

    let consumptionArrayResult = [], totalAdded = [];
    materials.forEach(object => {
      consumptionArrayResult.push({
        material: object.material,
        amount: 0,
        unit: object.unit
      });
      totalAdded.push({
        material: object.material,
        amount: 0,
        unit: object.unit
      });
    });

    allConsumptions.forEach(item => {
      consumptionArrayResult.forEach(element => {
        if (element.material === item.material && element.unit === item.unit) {
          element.amount += item.amount;
          return;
        }
      });
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
                <li>Клиент: {item.client}</li>
                <li>Телефон: {item.phone}</li>
                <li>Адрес: {item.address}</li>
                <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                <li>Сумма: {item.cost.toLocaleString()} UZS</li>
                <li>Тип Платежа: {item.paymentMethod}</li>

                {item.paymentMethod === 'Безналичный' ? <li className="pb-2">Счет-Фактура: {item.invoice}</li> : ''}

                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {renderConsumptionOfOrder}
                </ul>
                <li>Балл: {item.score}</li>
                <li>Отзыв Клиента: {item.clientReview}</li>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    let receivedMaterials = this.state.addedMaterials.map((item, index) => {

      let listItems = item.materials.map((thing, number) => {
        totalAdded.forEach(element => {
          if (element.material === thing.material && element.unit === thing.unit) {
            element.amount += thing.amount;
            return;
          }
        });
        return (
          <li key={number}>{thing.material}: {thing.amount.toLocaleString()} {thing.unit}</li>
        );
      });

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-3">
                <li>Админ: {item.admin.name}</li>
                <li>Когда получено: <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment></li>
                <h5 className="mb-0">Материалы:</h5>
                {listItems}
              </ul>
            </div>
          </div>
        </div>
      );
    });

    let renderTotalReceived = totalAdded.map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h2 className="text-center">Заказы</h2>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {ordersNumber}</li>
                  <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
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
                  <li className="pb-2">Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)} (из 10)</li>
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

        <div className="row mt-3">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Ваши полученные материалы за этот период</h2>
          </div>
        </div>

        <div className="row mt-2">
          {this.state.addedMaterials.length > 0 ? (
            <div className="col-lg-4 col-md-6">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <h4 className="text-center">Всего получено материалов за этот период</h4>
                  <ul className="font-bold mb-0 pl-3">
                    {renderTotalReceived}
                  </ul>
                </div>
              </div>
            </div>
          ) : <h3>Нет полученных материалов за этот период</h3>}
        </div>

        <div className="row mt-2">
          {this.state.addedMaterials.length > 0 ? receivedMaterials : ''}
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
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowDisinfStats));