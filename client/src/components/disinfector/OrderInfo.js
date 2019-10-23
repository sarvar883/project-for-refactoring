import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getOrders, addDisinfectorComment } from '../../actions/orderActions';
import Moment from 'react-moment';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

class OrderInfo extends Component {
  state = {
    addComment: false,
    disinfectorComment: this.props.orderObject.disinfectorComment,
    errors: {}
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  toggleAddComment = (e) => {
    e.preventDefault();
    this.setState({
      addComment: !this.state.addComment
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      id: this.props.orderObject._id,
      comment: this.state.disinfectorComment
    };
    this.props.addDisinfectorComment(object, this.props.history);
    this.setState({
      addComment: !this.state.addComment
    })
  };

  render() {
    const { orderObject } = this.props;
    const { errors } = this.state;

    let currentTime = new Date();

    return (
      <div className="col-lg-6 mt-3">
        <div className="card order">
          <div className="card-body p-0">
            <ul className="font-bold">
              <li>Дезинфектор: {orderObject.disinfectorId.name}</li>
              <li>Клиент: {orderObject.client}</li>
              <li>Телефонный номер клиента: {orderObject.phone}</li>
              {orderObject.phone2 !== '' ? (<li>Запасной номер: {orderObject.phone2}</li>) : ''}
              <li>Дата и Время выполнения: <Moment format="DD/MM/YYYY HH:mm">{orderObject.dateFrom}</Moment></li>
              <li>Адрес: {orderObject.address}</li>
              <li>Тип услуги: {orderObject.typeOfService}</li>
              <li>Комментарии Оператора: {orderObject.comment ? orderObject.comment : 'Нет комментариев'}</li>
              <li>Комментарии Дезинфектора: {this.state.disinfectorComment ? this.state.disinfectorComment : 'Нет комментариев'}</li>
              <li>Заказ Добавлен: {orderObject.userCreated.name} <Moment format="DD/MM/YYYY HH:mm">{orderObject.createdAt}</Moment></li>
            </ul>
            {this.state.addComment ? (
              <form onSubmit={this.onSubmit}>
                <TextAreaFieldGroup
                  name="disinfectorComment"
                  placeholder="Ваш комментарий"
                  value={this.state.disinfectorComment}
                  onChange={this.onChange}
                  error={errors.disinfectorComment}
                />
                <div className="btn-group">
                  <button type="submit" className="btn btn-success mr-3">Добавить</button>
                  <button type="button" className="btn btn-warning" onClick={this.toggleAddComment}>Закрыть</button>
                </div>
              </form>
            ) : (
                <button type="button" className="btn btn-success d-block" onClick={this.toggleAddComment}>Добавить Комментарий</button>
              )}
            {currentTime.getTime() > new Date(orderObject.dateFrom).getTime() ? (
              <Link to={`/order-complete-form/${orderObject._id}`} className="btn btn-primary mt-3">Форма О Выполнении</Link>
            ) : ''}
          </div>
        </div>
      </div>
    )
  }
}

OrderInfo.propTypes = {
  getOrders: PropTypes.func.isRequired,
  addDisinfectorComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrders, addDisinfectorComment })(withRouter(OrderInfo));