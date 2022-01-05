import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';


class RenderOrder extends Component {
  render() {
    const {
      order,
      shouldRenderIfOrderIsPovtor,
      shouldRenderIfOrderIsFailed,
      sholdRenderIfOrderIsReturned,
      shouldRenderOrderNumber,
      shouldRenderDisinfector,
      shouldRenderNextOrdersAfterFailArray,
      shouldRenderPrevFailedOrderDate,
      shouldRenderOperatorDecided,
      shouldRenderAccountantDecided,
      dateRenderMethod,
      shouldRenderGuarantee,
      shouldRenderMaterialConsumption,
      shouldRenderPaymentMethod,
      shouldRenderUserAcceptedOrder,
      shouldRenderUserCreated,
      shouldRenderCompletedAt,
      shouldRenderAdminGaveGrade,
    } = this.props;



    // consumption array of specific confirmed order
    const consumptionArray = [];

    if (order.disinfectors) {
      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });
    }

    const showMaterialConsumption = consumptionArray.map((object, number) => (
      <li key={number}>
        <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
        {object.consumption.map((element, number) =>
          <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
        )}
      </li>
    ));


    return (
      <React.Fragment>
        {shouldRenderIfOrderIsPovtor && order.prevFailedOrder && (
          <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
        )}


        {shouldRenderIfOrderIsFailed && order.failed && (
          <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
        )}

        {sholdRenderIfOrderIsReturned && order.returnedBack && (
          <li className="text-danger">Это возвращенный заказ</li>
        )}

        {shouldRenderOrderNumber && (
          <li><u>Номер заявки: {order.orderNumber || '--'}</u></li>
        )}

        {shouldRenderDisinfector && order.disinfectorId && (
          <li className='disinfector'>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
        )}


        {shouldRenderNextOrdersAfterFailArray && order.failed && order.nextOrdersAfterFailArray && (
          <React.Fragment>
            <li className="text-primary">Повторов у этого заказа: {order.nextOrdersAfterFailArray.length}</li>

            {order.nextOrdersAfterFailArray.length > 0 && (
              <React.Fragment>
                <li className="text-primary">Время последнего заказа: <Moment format="DD/MM/YYYY HH:mm">{order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].dateFrom}</Moment></li>

                <li className="text-primary">Выполняет последний заказ: {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.occupation} {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.name}</li>
              </React.Fragment>
            )}
          </React.Fragment>
        )}


        {shouldRenderPrevFailedOrderDate && order.prevFailedOrder && order.prevFailedOrder.disinfectorId && (
          <li className="text-primary">Предыдущий некачественный заказ: <Moment format="DD/MM/YYYY HH:mm">{order.prevFailedOrder.dateFrom}</Moment> ({order.prevFailedOrder.disinfectorId.occupation} {order.prevFailedOrder.disinfectorId.name})</li>
        )}


        {shouldRenderOperatorDecided && (
          <React.Fragment>
            {order.operatorDecided ? (
              <React.Fragment>
                {/* <li>Оператор рассмотрел заявку</li> */}
                {order.operatorConfirmed ? (
                  <React.Fragment>
                    <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                    <li>Балл (0-5): {order.score}</li>
                    <li>Отзыв Клиента: {order.clientReview || 'Нет Отзыва'}</li>
                  </React.Fragment>
                ) : (
                  <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                )}
              </React.Fragment>
            ) : <li>Оператор еще не рассмотрел заявку</li>}
          </React.Fragment>
        )}


        {shouldRenderAccountantDecided && (
          <React.Fragment>
            {order.accountantDecided ? (
              <React.Fragment>
                {/* <li>Бухгалтер рассмотрел заявку</li> */}
                {order.accountantConfirmed ? (
                  <React.Fragment>
                    <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                    <li>Счет-Фактура: {order.invoice || '--'}</li>
                    <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  </React.Fragment>
                ) : (
                  <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>

                {order.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {order.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                    ) : (
                      <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                    )}
                  </React.Fragment>
                ) : (
                  <li>Бухгалтер еще не рассмотрел заявку</li>
                )}

              </React.Fragment>
            )}
          </React.Fragment>
        )}


        {order.clientType === 'corporate' && (
          <React.Fragment>
            {order.clientId ? (
              <li className="client text-danger">Корпоративный Клиент: {order.clientId.name}</li>
            ) : (
              <li className="client text-danger">Корпоративный Клиент</li>
            )}
            <li className="client text-danger">Имя клиента: {order.client}</li>
          </React.Fragment>
        )}


        {order.clientType === 'client individual' && (
          <li className="text-danger">Физический Клиент: {order.client}</li>
        )}

        <li className="text-danger">Телефон клиента: {order.phone}</li>
        {order.phone2 && order.phone2.length > 0 && (<li>Запасной номер: {order.phone2}</li>)}


        {dateRenderMethod === 'default' && order.dateFrom && (
          <React.Fragment>
            <li className="date text-danger">Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
            <li className="date text-danger">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
          </React.Fragment>
        )}

        {dateRenderMethod === 'dateFromOnly' && order.dateFrom && (
          <li className="date text-danger">Дата и Время: <Moment format="DD/MM/YYYY HH:mm">{order.dateFrom}</Moment></li>
        )}


        <li className="address text-danger">Адрес: {order.address}</li>
        <li className="typeOfService text-danger">Тип услуги: {order.typeOfService}</li>
        <li className="text-danger">Откуда узнали: {order.advertising}</li>

        <li>Комментарии Оператора: {order.comment || '--'}</li>
        <li>Комментарии Дезинфектора: {order.disinfectorComment || '--'}</li>

        {shouldRenderGuarantee && order.completed && (
          <li>Срок гарантии (в месяцах): {order.guarantee}</li>
        )}

        {/* {shouldRenderMaterialConsumption && ( */}
        {shouldRenderMaterialConsumption && order.completed && order.disinfectors && (
          <React.Fragment>
            <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
            <ul className="font-bold mb-0">
              {showMaterialConsumption}
            </ul>
          </React.Fragment>
        )}


        {shouldRenderPaymentMethod && (
          <React.Fragment>
            {order.clientType === 'corporate' && (
              <React.Fragment>
                {order.paymentMethod === 'cash' ? (
                  <React.Fragment>
                    <li>Тип Платежа: Наличный</li>
                    <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <li>Тип Платежа: Безналичный</li>
                    <li>Номер Договора: {order.contractNumber || '--'}</li>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}

            {/* here it is not advised to change '?' to '&&' */}
            {order.clientType === 'individual' && order.cost ? (
              <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
            ) : ''}

          </React.Fragment>
        )}

        {shouldRenderUserAcceptedOrder && order.userAcceptedOrder && (
          <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
        )}


        {shouldRenderUserCreated && order.userCreated && (
          <li>Заказ добавил(a): {order.userCreated.occupation} {order.userCreated.name} <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
        )}

        {shouldRenderCompletedAt && (
          <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
        )}

        {shouldRenderAdminGaveGrade && order.adminGaveGrade && (
          <h4 className="text-primary">Оценка Админа: {order.adminGrade}</h4>
        )}
      </React.Fragment>
    )
  }
}


RenderOrder.defaultProps = {
  order: {},
  shouldRenderIfOrderIsPovtor: false,
  shouldRenderIfOrderIsFailed: false,
  sholdRenderIfOrderIsReturned: false,
  shouldRenderOrderNumber: false,
  shouldRenderDisinfector: true,
  shouldRenderNextOrdersAfterFailArray: false,
  shouldRenderPrevFailedOrderDate: false,
  shouldRenderOperatorDecided: false,
  shouldRenderAccountantDecided: false,
  dateRenderMethod: 'default',
  shouldRenderGuarantee: true,
  shouldRenderMaterialConsumption: false,
  shouldRenderPaymentMethod: false,
  shouldRenderUserAcceptedOrder: false,
  shouldRenderUserCreated: false,
  shouldRenderCompletedAt: true,
  shouldRenderAdminGaveGrade: false,
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(RenderOrder));