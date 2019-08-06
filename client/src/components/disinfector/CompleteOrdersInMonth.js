import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class CompleteOrdersInMonth extends Component {
  state = {
    orders: this.props.order.completeOrdersInMonth
  };

  render() {
    let completeOrders = this.state.orders.map((order, index) =>
      <div className="col-md-6 mt-3" key={index}>
        <div className="card order">
          <div className="card-body p-0">
            <ul className="font-bold mb-0">
              <li className={order.confirmed ? "pb-2 text-success" : "pb-2 text-danger"}>Статус: {order.confirmed ? "Подтвержден" : "Еще не подтвержден"}</li>
              <li className="pb-2">Клиент: {order.orderId.client}</li>
              <li className="pb-2">Дата выполнения: <Moment format="DD/MM/YYYY">{order.orderId.dateFrom}</Moment></li>
              <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{order.orderId.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.orderId.dateTo}</Moment></li>
              <li className="pb-2">Адрес: {order.orderId.address}</li>
              <li className="pb-2">Тип услуги: {order.orderId.typeOfService}</li>
              <li className="pb-2">Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
              {/* <li className="pb-2">Расход Материалов: {order.consumption}</li> */}
              <li className="pb-2">Общая Цена: {order.cost.toLocaleString()} Сум</li>
              <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      completeOrders
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(CompleteOrdersInMonth));