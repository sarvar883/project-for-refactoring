import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import materials from '../common/materials';
import RenderOrder from '../common/RenderOrder';


class ShowAdminStats extends Component {
  state = {
    // orders: this.props.admin.stats.orders,
    orders: this.props.orders,
    showOrders: false
  };

  toggleShowOrders = (param) => {
    this.setState({
      showOrders: param
    });
  };

  render() {
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

    this.state.orders.forEach(order => {
      if (order.completed) {
        completedOrders.push(order);

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

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    let renderConfirmedOrders = confirmedOrders.map((order, key) => {
      return (
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <RenderOrder
                  order={order}
                  shouldRenderIfOrderIsPovtor={false}
                  shouldRenderIfOrderIsFailed={false}
                  shouldRenderNextOrdersAfterFailArray={false}
                  shouldRenderDisinfector={true}
                  shouldRenderOperatorDecided={true}
                  shouldRenderAccountantDecided={true}
                  shouldRenderMaterialConsumption={false}
                  shouldRenderPaymentMethod={true}
                  shouldRenderUserAcceptedOrder={false}
                  shouldRenderUserCreated={false}
                  shouldRenderCompletedAt={true}
                />

                <Link className="btn btn-primary" to={`/order-full-details/${order._id}`}>Подробнее</Link>
              </ul>
            </div>
          </div>
        </div>
      );
    });

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h3 className="text-center">Заказы</h3>
                <ul className="font-bold mb-0 list-unstyled">
                  <li className='total'>Всего Получено Заказов: {this.state.orders.length}</li>
                  <li className='completed'>Выполнено Заказов: {completedOrders.length}</li>
                  <li className='confirmed'>Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li className='totalSum'>Общая Сумма: {totalSum}</li>
                  <li className='totalScore'>Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
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

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h3 className="text-center">Общий Расход Материалов:</h3>
                <ul className="font-bold mb-0 pl-3">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.showOrders ? (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12">
                <button className="btn btn-dark" onClick={this.toggleShowOrders.bind(this, false)}>Скрыть заказы</button>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Подтвержденные Заказы</h2>
              </div>
              {confirmedOrders.length > 0 ? (renderConfirmedOrders) : <h2>Нет подтвержденных заказов</h2>}
            </div>
          </React.Fragment>
        ) : (
          <button className="btn btn-dark" onClick={this.toggleShowOrders.bind(this, true)}>Показать заказы</button>
        )}
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