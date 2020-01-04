import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getNotCompOrders } from '../../actions/operatorActions'

class NotCompOrders extends Component {
  componentDidMount() {
    this.props.getNotCompOrders();
  }

  render() {
    let orders = this.props.operator.sortedOrders.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    let renderOrders = orders.map((order, index) =>
      <div className="col-lg-3 col-md-4 pl-0" key={index}>
        <div className="card order mt-2">
          <div className="card-body p-0">
            <ul className="font-bold list-unstyled mb-0">
              <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
              <li>Дата: <Moment format="DD/MM/YYYY HH:mm">{order.dateFrom}</Moment></li>

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

              <li>Телефон клиента: {order.phone}</li>
              {order.phone2 !== '' ? (<li>Запасной номер: {order.phone2}</li>) : ''}
              <li>Адрес: {order.address}</li>
              <Link to={`/order-details/${order._id}`} className="btn btn-primary mt-1">Подробнее</Link>
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        <div className="row m-0">
          <h2 className="m-auto">Невыполненные заказы</h2>
        </div>
        {this.props.operator.loadingSortedOrders ? <Spinner /> : (
          <div className="row m-0">
            {renderOrders}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getNotCompOrders })(withRouter(NotCompOrders));