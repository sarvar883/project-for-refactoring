import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import materials from '../common/materials';
import RenderOrder from '../common/RenderOrder';


class ShowDisStats extends Component {
  state = {
    orders: this.props.admin.stats.orders,
    acceptedOrders: this.props.admin.stats.acceptedOrders,
    showOrders: false
  };

  renderOrders = (orders) => {
    return orders.map((order, key) => {
      return (
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <RenderOrder
                  order={order}
                  shouldRenderIfOrderIsPovtor={true}
                  shouldRenderIfOrderIsFailed={false}
                  shouldRenderNextOrdersAfterFailArray={false}
                  shouldRenderDisinfector={true}
                  shouldRenderOperatorDecided={true}
                  shouldRenderAccountantDecided={true}
                  shouldRenderMaterialConsumption={true}
                  shouldRenderPaymentMethod={true}
                  shouldRenderUserAcceptedOrder={true}
                  shouldRenderUserCreated={true}
                  shouldRenderCompletedAt={true}
                />
              </ul>
            </div>
          </div>
        </div>
      );
    });
  };

  toggleShowOrders = (param) => {
    this.setState({
      showOrders: param
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
      if (order.completed) {

        order.disinfectors.forEach(element => {
          if (element.user._id === this.props.admin.stats.disinfectorId) {
            element.consumption.forEach(object => {
              totalConsumption.forEach(item => {
                if (object.material === item.material && object.unit === item.unit) {
                  item.amount += object.amount;
                }
              });
            });
          }
        });

      }

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

        {this.state.showOrders ? (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12">
                <button className="btn btn-dark" onClick={this.toggleShowOrders.bind(this, false)}>Скрыть заказы</button>
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

export default connect(mapStateToProps)(withRouter(ShowDisStats));