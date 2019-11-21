import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowOperatorStats extends Component {
  state = {
    // orders that operator accepted
    orders: this.props.operator.stats.sortedOrders
  };

  render() {
    let confirmedOrders = [],
      operatorDecidedOrders = [],
      rejectedOrders = [],
      totalScore = 0,
      totalSum = 0,
      totalConsumption = [];

    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
      if (order.completed && order.operatorDecided) {
        operatorDecidedOrders.push(order);

        if (order.operatorConfirmed && (order.adminConfirmed || order.accountantConfirmed)) {
          confirmedOrders.push(order);
          totalSum += order.cost / order.disinfectors.length;
          totalScore += order.score;
        }

        if (order.clientType === 'corporate') {
          if (!order.operatorConfirmed || !order.accountantConfirmed) {
            rejectedOrders.push(order);
          }
        } else if (order.clientType === 'individual') {
          if (!order.operatorConfirmed || !order.adminConfirmed) {
            rejectedOrders.push(order);
          }
        }
      }


      // calculate total consumption of all orders accepted by operator in given period
      order.disinfectors.forEach(element => {
        element.consumption.forEach(object => {
          totalConsumption.forEach(item => {
            if (object.material === item.material && object.unit === item.unit) {
              item.amount += object.amount;
            }
          });
        });
      });

    });

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h4 className="text-center">Заказы, которые вы приняли:</h4>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Всего Получено Заказов: {this.state.orders.length}</li>
                <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
                <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                <li>Средний балл подтвержденных заказов: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                <li>Отвергнутые заказы: {rejectedOrders.length}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h4 className="text-center">Общий Расход Материалов Заказов:</h4>
              <ul className="font-bold mb-0 pl-3">
                {renderTotalConsumption}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowOperatorStats));