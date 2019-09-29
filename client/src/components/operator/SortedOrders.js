import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

// socket.io
import openSocket from 'socket.io-client';

class SortedOrders extends Component {
  _isMounted = false;

  state = {
    date: new Date(),
    sortedOrders: this.props.operator.sortedOrders
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');

    socket.on('createOrder', data => {
      // check if today
      if (
        new Date(data.order.dateFrom).getDate() === new Date(this.props.date).getDate() &&
        new Date(data.order.dateFrom).getMonth() === new Date(this.props.date).getMonth() &&
        new Date(data.order.dateFrom).getFullYear() === new Date(this.props.date).getFullYear()
      ) {
        this.addOrderToDOM(data.order);
      }
    });

    socket.on('editOrder', data => {
      // check if today
      if (
        new Date(data.order.dateFrom).getDate() === new Date(this.props.date).getDate() &&
        new Date(data.order.dateFrom).getMonth() === new Date(this.props.date).getMonth() &&
        new Date(data.order.dateFrom).getFullYear() === new Date(this.props.date).getFullYear()
      ) {
        this.editOrderOnDOM(data.order);
      }
    });

    socket.on('deleteOrder', data => {
      // check if today
      if (
        new Date(data.orderDateFrom).getDate() === new Date(this.props.date).getDate() &&
        new Date(data.orderDateFrom).getMonth() === new Date(this.props.date).getMonth() &&
        new Date(data.orderDateFrom).getFullYear() === new Date(this.props.date).getFullYear()
      ) {
        this.removeOrderFromDOM(data.id);
      }
    });
  }

  addOrderToDOM = (order) => {
    if (this._isMounted) {
      this.setState(prevState => {
        const updatedOrders = [...prevState.sortedOrders];
        updatedOrders.push(order);
        return {
          sortedOrders: updatedOrders
        };
      });
    }
  }

  editOrderOnDOM = (order) => {
    if (this._isMounted) {
      let ordersInState = [...this.state.sortedOrders];
      for (let i = 0; i < ordersInState.length; i++) {
        if (ordersInState[i]._id.toString() === order._id.toString()) {
          ordersInState[i].disinfectorId = order.disinfectorId;
          ordersInState[i].client = order.client;
          ordersInState[i].address = order.address;
          ordersInState[i].dateFrom = order.dateFrom;
          ordersInState[i].phone = order.phone;
          ordersInState[i].typeOfService = order.typeOfService;
          ordersInState[i].comment = order.comment;
        }
      }
      this.setState({
        sortedOrders: ordersInState
      });
    }
  }

  removeOrderFromDOM = (id) => {
    if (this._isMounted) {
      let ordersInState = [...this.state.sortedOrders];
      ordersInState = ordersInState.filter(item => item._id.toString() !== id);
      this.setState({
        sortedOrders: ordersInState
      });
    }
  }

  onClick = (hour, date) => {
    let defaultDateMonth, defaultDateDay, defaultHourString;
    if (new Date(date).getMonth() < 10) {
      defaultDateMonth = `0${new Date(date).getMonth() + 1}`;
    } else {
      defaultDateMonth = `${new Date(date).getMonth() + 1}`;
    }

    if (new Date(date).getDate() < 10) {
      defaultDateDay = `0${new Date(date).getDate()}`;
    } else {
      defaultDateDay = new Date(date).getDate();
    }
    const defaultDateString = `${new Date(date).getFullYear()}-${defaultDateMonth}-${defaultDateDay}`;

    if (hour < 10) {
      defaultHourString = `0${hour}:00`;
    } else {
      defaultHourString = `${hour}:00`;
    }

    this.props.history.push('/create-order', {
      pathname: '/create-order',
      state: { hour: defaultHourString, date: defaultDateString }
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let array = [];
    for (let i = 0; i <= 23; i++) {
      array.push({ hour: i, elements: [] });
    }

    this.state.sortedOrders.forEach(order => {
      array[new Date(order.dateFrom).getHours()].elements.push(order);
    });

    let renderOrders, colnumber;

    let everythingToRender = array.map((object, index) => {
      if (object.elements.length === 1 || object.elements.length === 2) colnumber = 6;
      if (object.elements.length > 2) colnumber = 4;
      renderOrders = object.elements.map((element, i) =>
        <div className={`col-md-${colnumber} pr-0`} key={i}>
          <div className={`card mt-2 order order-bg-${element.disinfectorId.color}`}>
            <div className="card-body p-0">
              <ul className="font-bold mb-0">
                <li className="pb-2">Время: <Moment format="HH:mm">{element.dateFrom}</Moment></li>
                <li className="pb-2">Дезинфектор: {element.disinfectorId.name}</li>
                <li className="pb-2">Клиент: {element.client}</li>
                <li className="pb-2">Тел Клиента: {element.phone}</li>
                <li className="pb-2">Адрес: {element.address}</li>
                <li className="pb-2">Тип услуги: {element.typeOfService}</li>
                <li className="pb-2">Заказ принял: {element.userCreated.name}</li>
              </ul>
              <Link to={`/order-details/${element._id}`} className="btn btn-warning">Подробнее</Link>
            </div>
          </div>
        </div>
      );
      return (
        <div className="hours" key={index}>
          <div className="help row mt-3" id={`hour-${object.hour}`}>
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