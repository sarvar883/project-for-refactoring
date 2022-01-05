import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import calculateStats from '../../utils/calcStats';
import materials from '../common/materials';


class ShowAccStats extends Component {
  state = {
    // orders of only corporate clients
    orders: this.props.accountant.stats.orders
  };

  render() {
    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      completed,
      confirmedOrders,
      rejected,
    } = calculateStats(this.state.orders);


    let totalConsumption = [];
    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
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
              <h4 className="text-center">Заказы корпоративных клиентов:</h4>
              <ul className="font-bold mb-0 list-unstyled">
                <li className='total'>Всего Получено Заказов: {totalOrders}</li>
                <li className='completed'>Выполнено Заказов: {completed}</li>
                <li className='confirmed'>Подтверждено Заказов: {confirmedOrders.length}</li>
                <li className='totalSum'>Общая Сумма: {totalSum}</li>
                <li className='totalScore'>Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)}</li>
                <li>Отвергнуто Заказов: {rejected}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h4 className="text-center">Общий Расход Материалов Этих Заказов:</h4>
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
  accountant: state.accountant,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowAccStats));