import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import { getOrderById } from '../../actions/orderActions';

class OrderDetails extends Component {
  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
  }

  render() {
    const order = this.props.order.orderById;

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
                  <ul className="font-bold">
                    <li className="pb-2">Дезинфектор: {order.disinfectorId.name}</li>
                    <li className="pb-2">Клиент: {order.client}</li>
                    <li className="pb-2">Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.dateTo}</Moment></li>
                    <li className="pb-2">Адрес: {order.address}</li>
                    <li className="pb-2">Тип услуги: {order.typeOfService}</li>
                    <li className="pb-2">Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
                    <li className="pb-2">Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>
                    <li className="pb-2">Заказ Добавлен: <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
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
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById })(withRouter(OrderDetails));