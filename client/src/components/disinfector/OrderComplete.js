import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { getOrderById, submitCompleteOrder } from '../../actions/orderActions';

class OrderComplete extends Component {
  state = {
    consumption: '',
    clientReview: '',
    score: '',
    paymentMethod: '',
    cost: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
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
      orderId: this.props.match.params.id,
      disinfectorId: this.props.order.orderById.disinfectorId._id,
      consumption: this.state.consumption,
      clientReview: this.state.clientReview,
      score: this.state.score,
      paymentMethod: this.state.paymentMethod,
      cost: this.state.cost
    };

    this.props.submitCompleteOrder(object, this.props.history);
  };

  render() {
    const order = this.props.order.orderById;
    const { errors } = this.state;

    const paymentOptions = [
      { label: '-- Выберите тип платежа --', value: 0 },
      { label: 'Наличный', value: 'Наличный' },
      { label: 'Безналичный', value: 'Безналичный' }
    ];

    return (
      <div className="container">
        {this.props.order.loading ? <Spinner /> : (
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Заказ</h1>
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

        <div className="row">
          <div className="col-lg-8 col-md-10 m-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body">
                <h1 className="text-center">Форма о Выполнении Заказа</h1>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    label="Расход материалов:"
                    type="text"
                    name="consumption"
                    value={this.state.consumption}
                    onChange={this.onChange}
                    error={errors.consumption}
                  />
                  <TextFieldGroup
                    label="Балл:"
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
                  <SelectListGroup
                    name="paymentMethod"
                    value={this.state.paymentMethod}
                    onChange={this.onChange}
                    error={errors.paymentMethod}
                    options={paymentOptions}
                  />
                  <TextFieldGroup
                    label="Общая Сумма:"
                    type="number"
                    name="cost"
                    value={this.state.cost}
                    onChange={this.onChange}
                    error={errors.cost}
                  />
                  <button className="btn btn-success btn-block">Готово</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById, submitCompleteOrder })(withRouter(OrderComplete));