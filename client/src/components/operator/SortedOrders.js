import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class SortedOrders extends Component {
  state = {
    sortedOrders: this.props.operator.sortedOrders
  };

  render() {
    let array = [], currentTime = '';
    this.state.sortedOrders.forEach((item, index) => {
      if (index === 0) {
        if (new Date(item.dateFrom).getMinutes() >= 10) {
          currentTime = `${new Date(item.dateFrom).getHours()}:${new Date(item.dateFrom).getMinutes()}`;
        } else {
          currentTime = `${new Date(item.dateFrom).getHours()}:0${new Date(item.dateFrom).getMinutes()}`;
        }
        array.push({
          time: currentTime,
          times: 1,
          elements: [item]
        });
      } else {
        if (`${new Date(item.dateFrom).getHours()}:${new Date(item.dateFrom).getMinutes()}` !== currentTime) {
          if (new Date(item.dateFrom).getMinutes() >= 10) {
            currentTime = `${new Date(item.dateFrom).getHours()}:${new Date(item.dateFrom).getMinutes()}`;
          } else {
            currentTime = `${new Date(item.dateFrom).getHours()}:0${new Date(item.dateFrom).getMinutes()}`;
          }
          array.push({
            time: currentTime,
            times: 1,
            elements: [item]
          });
        } else {
          array[array.length - 1].times += 1;
          array[array.length - 1].elements.push(item);
        }

      }
    });

    let sortedOrders = array.map((item, index) => {
      return (
        <React.Fragment key={index}>
          <div className="row mt-3">
            <div className="col-12">
              <h1 className="mb-0">{item.time}</h1>
            </div>
            {item.elements.map((object, number) => {
              let colnumber;
              if (item.times === 1 || item.times === 2) colnumber = 6;
              if (item.times > 2) colnumber = 4;
              return (
                <div className={`col-md-${colnumber} pr-0`} key={number}>
                  <div className="card order mt-2">
                    <div className="card-body p-0">
                      <ul className="font-bold">
                        <li className="pb-2">Время выполнения C: <Moment format="HH:mm">{object.dateFrom}</Moment></li>
                        <li className="pb-2">Время выполнения ПО: <Moment format="HH:mm">{object.dateTo}</Moment></li>
                        <li className="pb-2">Дезинфектор: {object.disinfectorId.name}</li>
                        <li className="pb-2">Клиент: {object.client}</li>
                        <li className="pb-2">Адрес: {object.address}</li>
                        <li className="pb-2">Тип услуги: {object.typeOfService}</li>
                        <li className="pb-2">Комментарии Оператора: {object.comment ? object.comment : 'Нет комментариев'}</li>
                        <li className="pb-2">Комментарии Дезинфектора: {object.disinfectorComment ? object.disinfectorComment : 'Нет комментариев'}</li>
                        <li className="pb-2">Заказ Добавлен: <Moment format="DD/MM/YYYY HH:mm">{object.createdAt}</Moment></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </React.Fragment>
      )
    });

    return (
      sortedOrders
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(SortedOrders));