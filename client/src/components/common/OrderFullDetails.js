import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import { getOrderById } from '../../actions/orderActions';

class OrderFullDetails extends Component {
  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
  }

  render() {
    const order = this.props.order.orderById;

    // consumption array of specific confirmed order
    let consumptionArray = [];

    order.disinfectors.forEach(item => {
      consumptionArray.push({
        user: item.user,
        consumption: item.consumption
      });
    });

    let renderOrderConsumption = consumptionArray.map((object, number) =>
      <li key={number}>
        <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
        {object.consumption.map((element, number) =>
          <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
        )}
      </li>
    );

    return (
      <div className="container">
        {this.props.order.loading ? <Spinner /> : (
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Детали Заказа</h1>
            </div>

            <div className="col-lg-8 col-md-10 m-auto">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 list-unstyled">
                    <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>

                    {order.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку</li>
                        {order.operatorConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                            <li>Балл (0-5): {order.score}</li>
                            <li>Отзыв Клиента: {order.clientReview ? order.clientReview : 'Нет Отзыва'}</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : <li>Оператор еще не рассмотрел заявку</li>}

                    {order.clientType === 'corporate' && order.paymentMethod === 'notCash' && !order.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                    {order.clientType === 'corporate' && order.paymentMethod === 'notCash' && order.accountantDecided ?
                      <React.Fragment>
                        <li>Бухгалтер рассмотрел заявку</li>
                        {order.accountantConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                            <li>Счет-Фактура: {order.invoice}</li>
                            <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                      : ''}

                    {order.clientType === 'corporate' && order.paymentMethod === 'cash' && !order.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}

                    {order.clientType === 'corporate' && order.paymentMethod === 'cash' && order.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку</li>
                        {order.adminConfirmed ? (
                          <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                        ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : ''}

                    {order.clientType === 'individual' && !order.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}
                    {order.clientType === 'individual' && order.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку</li>
                        {order.adminConfirmed ? (
                          <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                        ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : ''}

                    {order.clientType === 'corporate' ?
                      <React.Fragment>
                        {order.clientId ? (
                          <li>Корпоративный Клиент: {order.clientId.name}</li>
                        ) : <li>Корпоративный Клиент</li>}
                        <li>Имя клиента: {order.client}</li>
                      </React.Fragment>
                      : ''}

                    {order.clientType === 'individual' ?
                      <li>Физический Клиент: {order.client}</li>
                      : ''}

                    <li>Телефон Клиента: {order.phone}</li>
                    {order.phone2 ? <li>Другой номер: {order.phone2}</li> : ''}
                    <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                    <li>Адрес: {order.address}</li>
                    <li>Тип услуги: {order.typeOfService}</li>
                    <li>Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                    <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
                    <li>Срок гарантии (в месяцах): {order.guarantee}</li>

                    <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                    <ul className="font-bold mb-0">
                      {renderOrderConsumption}
                    </ul>

                    {order.clientType === 'corporate' ? (
                      <React.Fragment>
                        {order.paymentMethod === 'cash' ? (
                          <React.Fragment>
                            <li>Тип Платежа: Наличный</li>
                            <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                          </React.Fragment>
                        ) : (
                            <React.Fragment>
                              <li>Тип Платежа: Безналичный</li>
                              <li>Номер Договора: {order.contractNumber}</li>
                            </React.Fragment>
                          )}
                      </React.Fragment>
                    ) : ''}

                    {order.clientType === 'individual' ?
                      <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      : ''}

                    {order.userAcceptedOrder ? (
                      <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                    ) : ''}

                    {order.userCreated ? (
                      <li>Заказ добавил: {order.userCreated.occupation} {order.userCreated.name} (<Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment>)</li>
                    ) : ''}

                    <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById })(withRouter(OrderFullDetails));