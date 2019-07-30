import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class SortedOrders extends Component {
  state = {
    sortedOrders: this.props.operator.sortedOrders
  };

  render() {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    let array = [], currentHour = 0;
    this.state.sortedOrders.forEach((item, index) => {
      if (new Date(item.dateFrom).getHours() === currentHour) {
        if (array.length > 0) {
          array[array.length - 1].times += 1;
          array[array.length - 1].elements.push(item);
        } else {
          array.push({
            hour: currentHour,
            times: 1,
            elements: [item]
          });
        }
      } else {
        currentHour = new Date(item.dateFrom).getHours();
        array.push({
          hour: currentHour,
          times: 1,
          elements: [item]
        });
      }
    });

    let renderOrders;
    let renderHours = hours.map((item) => {

      renderOrders = {};

      array.forEach(object => {
        if (object.hour === item) {
          let colnumber;
          if (object.times === 1 || object.times === 2) colnumber = 6;
          if (object.times > 2) colnumber = 4;
          renderOrders = object.elements.map((element, index) =>
            <div className={`col-md-${colnumber} pr-0`} key={index}>
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold">
                    <li className="pb-2">Время выполнения C <Moment format="HH:mm">{element.dateFrom}</Moment> ПО <Moment format="HH:mm">{element.dateTo}</Moment></li>
                    <li className="pb-2">Дезинфектор: {element.disinfectorId.name}</li>
                    <li className="pb-2">Клиент: {element.client}</li>
                    <li className="pb-2">Адрес: {element.address}</li>
                    <li className="pb-2">Тип услуги: {element.typeOfService}</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      });

      return (
        <div className="hours" key={item}>
          <div className="help row mt-3">
            <Link to="/create-order" className="btn btn-success mr-3">+</Link>
            <h1 className="d-inline mb-0">{`${item}:00`}</h1>
          </div>
          <div className="row">
            {renderOrders.length > 0 ? (renderOrders) : ''}
          </div>
        </div>
      )
    });

    return (
      renderHours
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