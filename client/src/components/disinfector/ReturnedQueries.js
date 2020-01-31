import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import { getReturnedQueries } from '../../actions/disinfectorActions';

class ReturnedQueries extends Component {
  state = {
    queries: [],
    loading: false
  };

  componentDidMount() {
    this.props.getReturnedQueries(this.props.auth.user.id);
    this.setState({
      loading: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disinfector.queries) {
      this.setState({
        queries: nextProps.disinfector.queries,
        loading: false
      });
    }
  }

  render() {
    let renderQueries = this.state.queries.map((order, index) =>
      <div className="col-lg-4 col-md-6 mt-3" key={index}>
        <div className="card order">
          <div className="card-body p-0">
            <ul className="font-bold mb-0 list-unstyled">

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


              {order.clientType === 'corporate' && !order.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

              {order.clientType === 'corporate' && order.accountantDecided ?
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
              <li>Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
              <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
              <li>Адрес: {order.address}</li>
              <li>Тип услуги: {order.typeOfService}</li>
              <li>Комментарии Оператора: {order.comment ? order.comment : 'Нет комментариев'}</li>
              <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : 'Нет комментариев'}</li>

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

              {order.clientType === 'individual' ?
                <li>Общая Сумма: {order.cost.toLocaleString()} UZS  (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                : ''}

              <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>

              <Link to={`/order-complete-form/${order._id}`} className="btn btn-primary">Заполнить форму выполнения заново</Link>
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Ваши Запросы, которые админ отправил назад для повторного заполнения формы </h2>
          </div>
        </div>

        <div className="row">
          {this.state.loading ? (
            <div className="col-12">
              <Spinner />
            </div>
          ) : (
              <React.Fragment>
                {this.state.queries.length === 0 ? (
                  <div className="col-12">
                    <h2 className="text-center pl-3 pr-3">Нет Запросов</h2>
                  </div>
                ) : renderQueries}
              </React.Fragment>
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, { getReturnedQueries })(withRouter(ReturnedQueries));