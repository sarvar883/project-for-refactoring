import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

class SortedOrders extends Component {
  state = {
    sortedOrders: this.props.operator.sortedOrders
  };

  onClick = (hour, date) => {
    this.props.history.push('/create-order', {
      pathname: '/create-order',
      state: { hour: hour, date: date }
    });
  };

  render() {
    let array = [];
    for (let i = 0; i <= 23; i++) {
      array.push({ hour: i, elements: [] });
    }

    this.state.sortedOrders.forEach(order => {
      for (let i = new Date(order.dateFrom).getHours(); i <= new Date(order.dateTo).getHours(); i++) {
        array[i].elements.push(order);
      }
    });

    let renderOrders, colnumber;

    let everythingToRender = array.map((object, index) => {
      if (object.elements.length === 1 || object.elements.length === 2) colnumber = 6;
      if (object.elements.length > 2) colnumber = 4;
      renderOrders = object.elements.map((element, index) =>
        <div className={`col-md-${colnumber} pr-0`} key={index}>
          <div className={`card mt-2 order order-bg-${element.disinfectorId.color}`}>
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
      );
      return (
        <div className="hours" key={index}>
          <div className="help row mt-3">
            <button to="/create-order" className="btn btn-success mr-3" onClick={this.onClick.bind(this, object.hour, this.props.operator.date)}>+</button>
            <h1 className="d-inline mb-0">{`${object.hour}:00`}</h1>
          </div>
          <div className="row">
            {renderOrders.length > 0 ? (renderOrders) : ''}
          </div>
        </div>
      )
    });

    return (
      everythingToRender
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