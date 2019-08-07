import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ShowDisinfStats extends Component {
  state = {
    confirmedOrders: this.props.disinfector.stats.confirmedOrders,
    orders: this.props.disinfector.stats.orders
  };

  render() {
    let confirmedOrdersNumber = this.state.confirmedOrders.length;
    let ordersNumber = this.state.orders.length;
    let totalSum = 0, cash = 0;

    let allConsumptions = [];

    this.state.confirmedOrders.forEach(item => {
      totalSum += item.completeOrderId.cost;
      if (item.completeOrderId.paymentMethod === 'Наличный') cash++;
      item.completeOrderId.consumption.forEach(element => allConsumptions.push(element));
    });

    let notCash = confirmedOrdersNumber - cash;
    const cashPercent = (cash * 100 / confirmedOrdersNumber).toFixed(1);
    const notCashPercent = (100 - cashPercent).toFixed(1);

    let consumptionArrayResult = [];
    allConsumptions.forEach((item, index) => {
      let b = 0;
      if (index === 0) {
        consumptionArrayResult.push({
          material: item.material,
          amount: item.amount,
          unit: item.unit
        });
      } else {
        consumptionArrayResult.forEach((element, i) => {
          if (element.material === item.material) {
            element.amount += item.amount;
            b++;
          }
        });
        if (b === 0) {
          consumptionArrayResult.push({
            material: item.material,
            amount: item.amount,
            unit: item.unit
          });
        }
      }
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
                <li className="pb-2">Выполнено Заказов: {confirmedOrdersNumber}</li>
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