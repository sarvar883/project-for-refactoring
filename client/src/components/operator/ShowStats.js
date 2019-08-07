import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ShowStats extends Component {
  state = {
    completeOrders: this.props.operator.stats.completeOrders,
    orders: this.props.operator.stats.orders
  };

  render() {
    let completeOrdersNumber = this.state.completeOrders.length; // only confirmed orders 
    let ordersNumber = this.state.orders.length;
    let totalSum = 0, cash = 0;

    let allConsumptions = [];

    this.state.completeOrders.forEach(item => {
      totalSum += item.cost;
      if (item.paymentMethod === 'Наличный') cash++;
      item.consumption.forEach(element => allConsumptions.push(element));
    });

    let notCash = completeOrdersNumber - cash;
    const cashPercent = (cash * 100 / completeOrdersNumber).toFixed(1);
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
                <li className="pb-2">Выполнено Заказов: {completeOrdersNumber}</li>
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
  chat: state.chat,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowStats));