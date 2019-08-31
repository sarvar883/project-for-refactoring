import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class CompleteOrdersInMonth extends Component {
  state = {
    orders: this.props.order.completeOrdersInMonth
  };

  render() {
    let completeOrders = this.state.orders.map((order, index) => {
      let consumptionRender = order.consumption.map((item, index) =>
        <li key={index}>{item.material} : {item.amount.toLocaleString()} {item.unit}</li>
      );

      return (
        <div className="col-md-6 mt-3" key={index}>
          <div className="card order">
            <div className="card-body p-0">
              <ul className="font-bold mb-0">
                <li>{order.operatorDecided ? 'Оператор рассмотрел заявку' : 'Оператор еще не рассмотрел заявку'}</li>
                {order.operatorDecided ?
                  <li className={order.operatorConfirmed ? "text-success" : "text-danger"}> {order.operatorConfirmed ? "Оператор Подтвердил" : "Оператор Отклонил"}</li>
                  : ''
                }

                <li>{order.adminDecided ? 'Админ рассмотрел заявку' : 'Админ еще не рассмотрел заявку'}</li>
                {order.adminDecided ?
                  <li className={order.adminConfirmed ? "text-success" : "text-danger"}>{order.adminConfirmed ? "Админ Подтвердил" : "Админ Отклонил"}</li>
                  : ''
                }

                <li>Клиент: {order.client}</li>
                <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
                <li>Тип Платежа: {order.paymentMethod}</li>

                {order.paymentMethod === 'Безналичный' ? <li>Счет-Фактура: {order.invoice}</li> : ''}

                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>
                <li>Общая Цена: {order.cost.toLocaleString()} Сум</li>
                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="row m-0">
        {completeOrders}
      </div>
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