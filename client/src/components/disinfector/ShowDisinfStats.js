import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';

class ShowDisinfStats extends Component {
  state = {
    orders: this.props.disinfector.stats.orders,
    acceptedOrders: this.props.disinfector.stats.acceptedOrders,
    addedMaterials: this.props.disinfector.stats.addedMaterials
  };



  renderOrders = (orders) => {

    return orders.map((order, key) => {
      // consumption array of specific order
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
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>

                {order.repeatedOrder ? (
                  <React.Fragment>
                    <li>Это повторный заказ</li>
                    {order.repeatedOrderDecided ? (
                      <React.Fragment>
                        <li>Решение по проведению повторной работы принята</li>
                        {order.repeatedOrderNeeded ? <li>Повторная Работа требуется</li> : <li>Повторная Работа Не требуется</li>}
                      </React.Fragment>
                    ) : <li>Решение по проведению повторной заявки еще не принята</li>}
                  </React.Fragment>
                ) : ''}

                {order.completed ? <li>Заказ выполнен</li> : <li>Заказ еще не выполнен</li>}

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

                {order.completed ? (
                  <React.Fragment>
                    <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                  </React.Fragment>
                ) : ''}

                {!order.completed && order.repeatedOrder && order.repeatedOrderDecided && order.repeatedOrderNeeded ? (
                  <React.Fragment>
                    <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                  </React.Fragment>
                ) : ''}

                <li>Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>

                {order.completed ?
                  <React.Fragment>
                    <li>Срок гарантии (в месяцах): {order.guarantee}</li>
                    <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                    <ul className="font-bold mb-0">
                      {renderOrderConsumption}
                    </ul>
                  </React.Fragment>
                  : ''}

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

                {order.completed && order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                {order.userAcceptedOrder ? (
                  <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                ) : ''}

                <li>Заказ добавил: {order.userCreated.occupation} {order.userCreated.name} (<Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment>)</li>

                {order.completed ?
                  <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li> : ''}
              </ul>
            </div>
          </div>
        </div>
      );
    });

  };






  render() {
    let operatorDecidedOrders = [],
      confirmedOrders = [],
      rejectedOrders = [],
      totalScore = 0,
      totalSum = 0,
      totalSumOfAcceptedOrders = 0,
      totalConsumption = [],
      emptyArray = [];

    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };

      emptyArray.push(emptyObject);
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
          if (!order.operatorConfirmed || (order.accountantDecided && !order.accountantConfirmed)) {
            rejectedOrders.push(order);
          }
        } else if (order.clientType === 'individual') {
          if (!order.operatorConfirmed || (order.adminDecided && !order.adminConfirmed)) {
            rejectedOrders.push(order);
          }
        }
      }


      totalConsumption = [...emptyArray];
      // calculate total consumption of all orders in given period of the logged in disinfector
      order.disinfectors.forEach(element => {
        if (element.user._id.toString() === this.props.auth.user.id) {
          element.consumption.forEach(object => {
            totalConsumption.forEach(item => {
              if (object.material === item.material && object.unit === item.unit) {
                item.amount += object.amount;
              }
            });
          });
        }
      });
    });

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    this.state.acceptedOrders.forEach(order => {

      if (order.clientType === 'corporate') {
        if (order.completed && order.operatorConfirmed && order.accountantConfirmed) {
          totalSumOfAcceptedOrders += order.cost;
        }
      }

      if (order.clientType === 'individual') {
        if (order.completed && order.operatorConfirmed && order.adminConfirmed) {
          totalSumOfAcceptedOrders += order.cost;
        }
      }

    });

    let renderConfirmedOrders = this.renderOrders(confirmedOrders);
    let renderAcceptedOrders = this.renderOrders(this.state.acceptedOrders);

    // let renderConfirmedOrders = confirmedOrders.map((item, key) => {
    //   // consumption array of specific confirmed order
    //   let consumptionArray = [];

    //   item.disinfectors.forEach(element => {
    //     consumptionArray.push({
    //       user: element.user,
    //       consumption: element.consumption
    //     });
    //   });

    //   let renderOrderConsumption = consumptionArray.map((object, number) =>
    //     <li key={number}>
    //       <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
    //       {object.consumption.map((element, number) =>
    //         <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
    //       )}
    //     </li>
    //   );


    //   return (
    //     <div className="col-lg-4 col-md-6" key={key}>
    //       <div className="card order mt-2">
    //         <div className="card-body p-0">
    //           <ul className="font-bold mb-0 list-unstyled">
    //             <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>

    //             {item.clientType === 'corporate' ?
    //               <React.Fragment>
    //                 <li>Корпоративный Клиент: {item.clientId.name}</li>
    //                 <li>Имя клиента: {item.client}</li>
    //               </React.Fragment>
    //               : ''}

    //             {item.clientType === 'individual' ?
    //               <li>Физический Клиент: {item.client}</li>
    //               : ''}


    //             <li>Телефон Клиента: {item.phone}</li>
    //             {item.phone2 ? <li>Другой номер: {item.phone2}</li> : ''}
    //             <li>Адрес: {item.address}</li>
    //             <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
    //             <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
    //             <li>Комментарии Оператора: {item.comment ? item.comment : 'Нет комментариев'}</li>
    //             <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : 'Нет комментариев'}</li>

    //             <li>Расход Материалов (заказ выполнили {item.disinfectors.length} чел):</li>
    //             <ul className="font-bold mb-0">
    //               {renderOrderConsumption}
    //             </ul>

    //             {item.clientType === 'corporate' ?
    //               <React.Fragment>
    //                 <li>Номер Договора: {item.contractNumber}</li>
    //                 {item.accountantDecided && item.accountantConfirmed ? (
    //                   <React.Fragment>
    //                     <li>Счет-Фактура: {item.invoice}</li>
    //                     <li>Общая Cумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
    //                   </React.Fragment>
    //                 ) : ''}
    //               </React.Fragment>
    //               : ''}

    //             {item.clientType === 'individual' ?
    //               <React.Fragment>
    //                 <li>Общая Cумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
    //               </React.Fragment>
    //               : ''}

    //             <li>Балл: {item.score}</li>
    //             <li>Отзыв Клиента: {item.clientReview}</li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // });


    // total received materials that disinfector received from admin in given period
    let totalReceivedMaterials = [];
    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };

      totalReceivedMaterials.push(emptyObject);
    });

    if (this.state.addedMaterials.length > 0) {
      this.state.addedMaterials.forEach(addEvent => {
        addEvent.materials.forEach(material => {
          totalReceivedMaterials.forEach(helpObject => {
            if (material.material === helpObject.material && material.unit === helpObject.unit) {
              helpObject.amount += material.amount;
            }
          });
        });
      });
    }

    let receivedMaterials = this.state.addedMaterials.map((item, index) => {
      let listItems = item.materials.map((thing, number) =>
        <li key={number}>{thing.material}: {thing.amount.toLocaleString()} {thing.unit}</li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-3">
                <li>Админ: {item.admin.name}</li>
                <li>Когда получено: <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment></li>
                <h5 className="mb-0">Материалы:</h5>
                {listItems}
              </ul>
            </div>
          </div>
        </div>
      );
    });

    let renderTotalReceived = totalReceivedMaterials.map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Заказы</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {this.state.orders.length}</li>
                  <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Отвергнуто заказов: {rejectedOrders.length}</li>
                  <li className="pb-2">Средний балл подтвержденных заказов: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>

                  <li>Принятые заказы: {this.state.acceptedOrders.length}</li>
                  <li>Общая сумма принятых заказов: {totalSumOfAcceptedOrders.toLocaleString()} UZS</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Приход материалов за этот период:</h4>
                <ul className="font-bold mb-0 pl-3">
                  {renderTotalReceived}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Расход Материалов за этот период:</h4>
                <ul className="font-bold mb-0 pl-3">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.addedMaterials.length > 0 ? (
          <React.Fragment>
            <div className="row mt-3">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Ваши полученные материалы за этот период</h2>
              </div>
            </div>

            <div className="row mt-2">
              {receivedMaterials}
            </div>
          </React.Fragment>
        ) : ''}

        <div className="row">
          <div className="col-12 mt-3">
            <h2 className="text-center pl-3 pr-3">Подтвержденные Заказы</h2>
          </div>
          {confirmedOrders.length > 0 ? (renderConfirmedOrders) : <h2>Нет подтвержденных заказов</h2>}
        </div>

        <div className="row">
          <div className="col-12 mt-3">
            <h2 className="text-center pl-3 pr-3">Принятые Заказы Пользователя</h2>
          </div>
          {this.state.acceptedOrders.length > 0 ? (renderAcceptedOrders) : <h2>Нет заказов</h2>}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowDisinfStats));