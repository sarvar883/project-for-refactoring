import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { getCompleteOrderById, confirmCompleteOrder } from '../../actions/operatorActions';

class ConfirmOrder extends Component {
  state = {
    clientReview: '',
    score: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getCompleteOrderById(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      completeOrderId: this.props.operator.completeOrderById._id,
      disinfectorId: this.props.operator.completeOrderById.disinfectorId._id,
      clientReview: this.state.clientReview,
      score: this.state.score,
      orderDate: this.props.operator.completeOrderById.orderId.dateFrom
    };
    this.props.confirmCompleteOrder(object, this.props.history);
  }

  reject = (e) => {
    e.preventDefault();
    console.log('reject');
  }

  render() {
    const completeOrder = this.props.operator.completeOrderById;
    const { errors } = this.state;

    let consumptionRender;
    if (completeOrder.consumption) {
      consumptionRender = completeOrder.consumption.map((item, index) =>
        <li key={index}>{item.material} : {item.amount} {item.unit}</li>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          {this.props.operator.loadingCompleteOrders ? <Spinner /> : (

            <div className="col-lg-6 col-md-9 mx-auto">
              <h2 className="text-center">Выполненный Заказ</h2>
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0">
                    <li className="pb-2">Дезинфектор: {completeOrder.disinfectorId.name}</li>
                    <li className="pb-2">Клиент: {completeOrder.orderId.client}</li>
                    <li className="pb-2">Дата: <Moment format="DD/MM/YYYY">{completeOrder.orderId.dateFrom}</Moment></li>
                    <li className="pb-2">Время выполнения: С <Moment format="HH:mm">{completeOrder.orderId.dateFrom}</Moment> ПО <Moment format="HH:mm">{completeOrder.orderId.dateTo}</Moment></li>
                    <li className="pb-2">Адрес: {completeOrder.orderId.address}</li>
                    <li className="pb-2">Тип услуги: {completeOrder.orderId.typeOfService}</li>
                    <li className="pb-2">Комментарии Оператора: {completeOrder.comment ? completeOrder.comment : 'Нет комментариев'}</li>
                    <li className="pb-2">Комментарии Дезинфектора: {completeOrder.disinfectorComment ? completeOrder.disinfectorComment : 'Нет комментариев'}</li>
                    <li>Расход Материалов:</li>
                    <ul className="font-bold mb-0">
                      {consumptionRender}
                    </ul>
                    <li className="pb-2">Тип Платежа: {completeOrder.paymentMethod}</li>
                    <li className="pb-2">Общая Сумма: {completeOrder.cost ? completeOrder.cost.toLocaleString() : ''} UZS</li>
                    <li className="pb-2">Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{completeOrder.createdAt}</Moment></li>
                  </ul>
                  <button className="btn btn-danger" onClick={this.reject}>Отменить Выполнение Заказа</button>
                </div>
              </div>
            </div>
          )}
          <div className="col-lg-6 col-md-9 mx-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body p-2">
                <h2 className="text-center">Форма Подтверждения Заказа</h2>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    label="Полученный Балл за Выполнение Заказа:"
                    type="number"
                    name="score"
                    value={this.state.score}
                    onChange={this.onChange}
                    error={errors.score}
                  />
                  <TextAreaFieldGroup
                    name="clientReview"
                    placeholder="Отзыв Клиента"
                    value={this.state.clientReview}
                    onChange={this.onChange}
                    error={errors.clientReview}
                  />
                  <button className="btn btn-success btn-block">Подтвердить Выполнение Заказа</button>
                </form>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, { getCompleteOrderById, confirmCompleteOrder })(withRouter(ConfirmOrder));