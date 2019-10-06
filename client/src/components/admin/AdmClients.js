import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import TextFieldGroup from '../common/TextFieldGroup';
import { searchClients } from '../../actions/adminActions';

class AdmClients extends Component {
  state = {
    name: '',
    phone: '',
    address: '',
    method: '',
    headingText: '',
    clients: []
  };

  componentDidMount() {
    this.setState({
      method: 'all'
    });
    const object = {
      method: 'all',
      payload: ''
    };
    this.props.searchClients(object);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      clients: nextProps.admin.clients
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  searchByName = (e) => {
    e.preventDefault();
    this.setState({
      method: 'name',
      headingText: this.state.name
    });
    const object = {
      method: 'name',
      payload: this.state.name
    };
    this.props.searchClients(object);
  }

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
    this.props.searchClients(object);
  }

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
    this.props.searchClients(object);
  }

  searchAll = (e) => {
    e.preventDefault();
    this.setState({
      method: 'all'
    });
    const object = {
      method: 'all',
      payload: ''
    };
    this.props.searchClients(object);
  }

  render() {
    let renderClients = this.state.clients.map((client, index) => {
      let totalSum = 0, score = 0, cash = 0, notCash, cashPercent, notCashPercent;

      notCash = client.orders.length - cash;
      cashPercent = (cash * 100 / client.orders.length).toFixed(1);
      notCashPercent = (100 - cashPercent).toFixed(1);

      let clientDetails = (
        <div className="row mt-2">
          <div className="col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 pl-3">
                  <li>Имя: {client.name}</li>
                  <li>Номер телефона: {client.phone}</li>
                  <li>Адрес: {client.address}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 pl-3">
                  <li>Получено заказов от клиента: {client.orders.length}</li>
                  <li>Средняя оценка: {(score / client.orders.length).toFixed(2)}</li>
                  <li>Общая Сумма выполненных заказов: {totalSum.toLocaleString()} UZS</li>
                  <li>Тип Платежей:</li>
                  <ul className="font-bold mb-1">
                    <li>Наличный: {cash} ({cashPercent} %)</li>
                    <li>Безналичный: {notCash} ({notCashPercent} %)</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );

      let clientOrders = client.orders.map((item, key) => {
        totalSum += item.cost;
        score += item.score;
        if (item.paymentMethod === 'Наличный') {
          cash++;
        }

        let renderConsumptionOfOrder = item.consumption.map((material, index) =>
          <li key={index}>{material.material} : {material.amount.toLocaleString()} {material.unit}</li>
        );

        return (
          <div className="col-lg-4 col-md-6" key={key}>
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Тип услуги: {item.typeOfService}</li>
                  <li>Откуда узнали: {item.advertising}</li>
                  <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>

                  {item.completed ? (
                    <React.Fragment>
                      <li className="text-success">Заказ Выполнен</li>
                      <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                      <li>Сумма: {item.cost.toLocaleString()} UZS</li>
                      <li>Тип Платежа: {item.paymentMethod}</li>

                      {item.paymentMethod === 'Безналичный' ? <li>Счет-Фактура: {item.invoice}</li> : ''}

                      <li>Расход Материалов:</li>
                      <ul className="font-bold mb-0">
                        {renderConsumptionOfOrder}
                      </ul>
                    </React.Fragment>
                  ) : <li>Заказ еще не выполнен</li>}

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
                  ) : ''}
                </ul>
              </div>
            </div>
          </div>
        )
      });

      return (
        <React.Fragment key={index}>
          <div className="row">
            <div className="col-12">
              <h2 className="text-center">Клиент: {client.name}</h2>
            </div>
          </div>

          <div className="row m-0">
            {clientDetails}
          </div>

          <div className="row mt-2 pb-1 client-stats-order">
            {clientOrders}
          </div>
        </React.Fragment>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByName} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по имени клиента</h4>
              <TextFieldGroup
                type="text"
                placeholder="Имя"
                name="name"
                value={this.state.client}
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
                placeholder="Номер телефона"
                name="phone"
                value={this.state.phone}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>

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
              <button type="submit" className="btn btn-dark">Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.searchAll}>
              <button type="submit" className="btn btn-info">Посмотреть все клиенты</button>
            </form>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {this.state.method === 'name' ? <h2 className="text-center">Результаты поиска клиентов по имени "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'phone' ? <h2 className="text-center">Результаты поиска клиентов по номеру телефона "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'address' ? <h2 className="text-center">Результаты поиска клиентов по адресу "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'all' ? <h2 className="text-center">Все клиенты</h2> : ''}
          </div>
        </div>

        {this.props.admin.loadingClients ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
            renderClients
          )}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { searchClients })(withRouter(AdmClients));