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
        <li key={index}>{item.material} : {item.amount} {item.unit}</li>
      );

      return (
        <div className="col-md-6 mt-3" key={index}>
          <div className="card order">
            <div className="card-body p-0">
              <ul className="font-bold mb-0">
                <li className="pb-2">{order.operatorDecided ? 'Оператор рассмотрел заявку' : 'Оператор еще не рассмотрел заявку'}</li>
                {order.operatorDecided ?
                  <li className={order.operatorConfirmed ? "pb-2 text-success" : "pb-2 text-danger"}> {order.operatorConfirmed ? "Оператор Подтвердил" : "Оператор Отклонил"}</li>
                  : ''
                }

                <li className="pb-2">{order.adminDecided ? 'Админ рассмотрел заявку' : 'Админ еще не рассмотрел заявку'}</li>
                {order.adminDecided ?
                  <li className={order.adminConfirmed ? "pb-2 text-success" : "pb-2 text-danger"}>{order.adminConfirmed ? "Админ Подтвердил" : "Админ Отклонил"}</li>
                  : ''
                }

                <li className="pb-2">Клиент: {order.client}</li>
                <li className="pb-2">Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li className="pb-2">Адрес: {order.address}</li>
                <li className="pb-2">Тип услуги: {order.typeOfService}</li>
                <li className="pb-2">Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
                <li className="pb-2">Тип Платежа: {order.paymentMethod}</li>

                {order.paymentMethod === 'Безналичный' ? <li className="pb-2">Счет-Фактура: {order.invoice}</li> : ''}

                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>
                <li className="pb-2">Общая Цена: {order.cost.toLocaleString()} Сум</li>
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