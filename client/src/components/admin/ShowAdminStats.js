import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import materials from '../common/materials';
import calculateStats from '../../utils/calcStats';
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
    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      completed,
      confirmedOrders,

      corporate,
      corporatePercent,
      corpSum,
      corpSumPercent,

      indiv,
      indivPercent,
      indivSum,
      indivSumPercent
    } = calculateStats(this.state.orders);


    let totalConsumption = [];
    materials.forEach(object => {
      const emptyObject = {
        material: object.material,
        amount: 0,
        unit: object.unit
      };
      totalConsumption.push(emptyObject);
    });

    // calculate total consumption of all orders in given period
    this.state.orders.forEach(order => {
      order.disinfectors.forEach(element => {
        element.consumption.forEach(object => {
          totalConsumption.forEach(item => {
            if (object.material === item.material && object.unit === item.unit) {
              item.amount += object.amount;
            }
          });
        });
      });
    })


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
                  <li className='total'>Всего Получено Заказов: {totalOrders}</li>
                  <li className='completed'>Выполнено Заказов: {completed}</li>
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
                  <li>Подтвержденные заказы: {corporate} ({corporatePercent} %)</li>
                  <li>На общую сумму: {corpSum.toLocaleString()} UZS  ({corpSumPercent} %)</li>

                  <h4 className="text-center">Физические клиенты</h4>
                  <li>Подтвержденные заказы: {indiv} ({indivPercent} %)</li>
                  <li>На общую сумму: {indivSum.toLocaleString()} UZS ({indivSumPercent} %)</li>
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