import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import TextFieldGroup from '../common/TextFieldGroup';
import { searchOrders } from '../../actions/orderActions';

class SearchOrders extends Component {
  state = {
    phone: '',
    address: '',
    method: '',
    headingText: '',
    orders: []
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      orders: nextProps.order.orders
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  searchByAddress = (e) => {
    e.preventDefault();
    this.setState({
      method: 'address',
      headingText: this.state.address
    });
    const object = {
      method: 'address',
      payload: this.state.address
    };
    this.props.searchOrders(object);
  };

  searchByPhone = (e) => {
    e.preventDefault();
    this.setState({
      method: 'phone',
      headingText: this.state.phone
    });
    const object = {
      method: 'phone',
      payload: this.state.phone
    };
    this.props.searchOrders(object);
  };

  render() {
    let renderOrders = this.state.orders.map((item, index) => {
      let consumptionRender;
      if (item.consumption) {
        consumptionRender = item.consumption.map((item, index) =>
          <li key={index}>{item.material} : {item.amount} {item.unit}</li>
        );
      }

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li>Дезинфектор: {item.disinfectorId.name}</li>
                <li>Клиент: {item.client}</li>
                <li>Телефон: {item.phone}</li>
                {item.phone2 && item.phone2 !== '' ? <li>Запасной номер: {item.phone2}</li> : ''}
                <li>Адрес: {item.address}</li>
                <li>Откуда узнали: {item.advertising}</li>
                <li>Тип услуги: {item.typeOfService}</li>
                <li>Дата: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                <li>Срок гарантии (в месяцах): {item.guarantee}</li>
                <li>Комментарии: {item.comment ? item.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : '--'}</li>
                <li>Расход Материалов:</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>
                <li>Тип Платежа: {item.paymentMethod}</li>
                {item.paymentMethod === 'Безналичный' ? <li>Счет-Фактура: {item.invoice}</li> : ''}
                <li>Общая Сумма: {item.cost ? item.cost.toLocaleString() : ''} UZS</li>

                {item.completed && item.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>
                    {item.operatorConfirmed ? <li className="text-success">Оператор подтвердил заяку</li> : <li className="text-danger">Оператор отверг заяку</li>}
                    <li>Балл: {item.score}</li>
                    <li>Отзыв Клиента: {item.clientReview}</li>
                  </React.Fragment>
                ) : <li>Оператор еще рассмотрел заявку</li>}

                {item.completed && item.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                    {item.adminConfirmed ? <li className="text-success">Админ подтвердил заяку</li> : <li className="text-danger">Админ отверг заяку</li>}
                  </React.Fragment>
                ) : <li>Админ еще не рассмотрел заявку</li>}

                {item.repeatedOrder ? (
                  <React.Fragment>
                    <li className="mt-2">Это повторный заказ</li>
                    {item.repeatedOrderDecided ? (
                      <React.Fragment>
                        <li>Решение по проведению повторной работы принято</li>
                        {item.repeatedOrderNeeded ? (
                          <li>Повторная работа будет проведена</li>
                        ) : (
                            <li>Повторная работа не требуется</li>
                          )}
                      </React.Fragment>
                    ) : (
                        <li>Решение по проведению повторной работы еще не принято</li>
                      )}
                  </React.Fragment>
                ) : ''}
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <h2 className="m-auto">Поиск заказов</h2>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByAddress} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по адресу</h4>
              <TextFieldGroup
                type="text"
                placeholder="Адрес"
                name="address"
                value={this.state.address}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>
          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByPhone} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по номеру телефона</h4>
              <TextFieldGroup
                type="text"
                placeholder="Номер Телефона"
                name="phone"
                value={this.state.phone}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-dark">Искать</button>
            </form>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {this.state.method === 'phone' ? <h2 className="text-center">Результаты поиска заказов по номеру телефона "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'address' ? <h2 className="text-center">Результаты поиска заказов по адресу "{this.state.headingText}"</h2> : ''}
          </div>
        </div>

        {this.props.order.loading ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
            <div className="row mt-3">
              {this.state.headingText.length > 0 && this.props.order.orders.length === 0 ? (
                <h2 className="m-auto">Заказы не найдены</h2>
              ) : renderOrders}
            </div>
          )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { searchOrders })(withRouter(SearchOrders));