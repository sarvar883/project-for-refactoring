import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import materials from '../common/materials';

class ShowDisinfStats extends Component {
  state = {
    orders: this.props.disinfector.stats.orders
  };

  render() {
    let operatorDecidedOrders = [], confirmedOrders = [], rejectedOders = [];

    this.state.orders.forEach(item => {
      if (item.completed && item.operatorDecided) {
        operatorDecidedOrders.push(item);

        if (item.operatorConfirmed) {
          confirmedOrders.push(item);
        } else {
          rejectedOders.push(item);
        }
      }
    })

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

    return (
      <React.Fragment>
        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h2 className="text-center">Заказы</h2>
              <ul className="font-bold mb-0 list-unstyled">
                <li className="pb-2">Всего Получено Заказов: {ordersNumber}</li>
                <li className="pb-2">Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
                <li className="pb-2">Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                <li>Тип Платежей:</li>
                <ul className="font-bold mb-1">
                  <li>Наличный: {cash} ({cashPercent} %)</li>
                  <li>Безналичный: {notCash} ({notCashPercent} %)</li>
                </ul>
                <li>Расход Материалов:</li>
                <ul className="font-bold mb-1">
                  {renderConsumption}
                </ul>
              </ul>
            </div>
          </div>
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