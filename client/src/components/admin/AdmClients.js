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

      let totalSum = 0,
        totalScore = 0,
        operatorDecidedOrders = [],
        confirmedOrders = [],
        rejectedOrders = [];

      let clientOrders = client.orders.map((item, key) => {

        if (item.completed && item.operatorDecided) {
          operatorDecidedOrders.push(item);

          if (item.operatorConfirmed && (item.adminConfirmed || item.accountantConfirmed)) {
            confirmedOrders.push(item);
            totalSum += item.cost;
            totalScore += item.score;
          }

          if (item.clientType === 'corporate') {
            if (!item.operatorConfirmed || (item.accountantDecided && !item.accountantConfirmed)) {
              rejectedOrders.push(item);
            }
          } else if (item.clientType === 'individual') {
            if (!item.operatorConfirmed || (item.adminDecided && !item.adminConfirmed)) {
              rejectedOrders.push(item);
            }
          }
        }

        // consumption array of specific order
        let consumptionArray = [];

        item.disinfectors.forEach(element => {
          consumptionArray.push({
            user: element.user,
            consumption: element.consumption
          });
        });

        let renderOrderConsumption = consumptionArray.map((object, number) =>
          <li key={number}>
            <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
            {object.consumption.map((element, number) =>
              <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
            )}
          </li>
        );

        return (
          <div className="col-lg-4 col-md-6" key={key}>
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>

                  {item.operatorDecided ? (
                    <React.Fragment>
                      <li>Оператор рассмотрел заявку</li>
                      {item.operatorConfirmed ? (
                        <React.Fragment>
                          <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>
                          <li>Балл (0-5): {item.score}</li>
                          <li>Отзыв Клиента: {item.clientReview ? item.clientReview : 'Нет Отзыва'}</li>
                        </React.Fragment>
                      ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>}
                    </React.Fragment>
                  ) : <li>Оператор еще не рассмотрел заявку</li>}

                  {item.clientType === 'corporate' && !item.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                  {item.clientType === 'corporate' && item.accountantDecided ?
                    <React.Fragment>
                      <li>Бухгалтер рассмотрел заявку</li>
                      {item.accountantConfirmed ? (
                        <React.Fragment>
                          <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>
                          <li>Счет-Фактура: {item.invoice}</li>
                          <li>Общая Сумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                        </React.Fragment>
                      ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>}
                    </React.Fragment>
                    : ''}

                  {item.clientType === 'individual' && !item.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}
                  {item.clientType === 'individual' && item.adminDecided ? (
                    <React.Fragment>
                      <li>Админ рассмотрел заявку</li>
                      {item.adminConfirmed ? (
                        <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                      ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>}
                    </React.Fragment>
                  ) : ''}

                  <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                  {item.completed ? (
                    <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                  ) : (
                      <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment></li>
                    )}
                  <li>Адрес: {item.address}</li>
                  <li>Тип услуги: {item.typeOfService}</li>
                  <li>Комментарии Оператора: {item.comment ? item.comment : 'Нет комментариев'}</li>
                  <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : 'Нет комментариев'}</li>
                  {item.completed ? (
                    <React.Fragment>
                      <li>Срок гарантии (в месяцах): {item.guarantee}</li>

                      <li>Расход Материалов (заказ выполнили {item.disinfectors.length} чел):</li>
                      <ul className="font-bold mb-0">
                        {renderOrderConsumption}
                      </ul>
                    </React.Fragment>
                  ) : ''}

                  {item.completed && item.clientType === 'corporate' ?
                    <li>Номер Договора: {item.contractNumber}</li>
                    : ''}

                  {item.completed && item.clientType === 'individual' ?
                    <li>Общая Сумма: {item.cost.toLocaleString()} UZS, (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                    : ''}

                  <li>Заказ принял: {item.userAcceptedOrder.occupation} {item.userAcceptedOrder.name}</li>
                  <li>Заказ добавил: {item.userCreated.occupation} {item.userCreated.name} (<Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment>)</li>

                  {item.completed ? <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{item.completedAt}</Moment></li> : ''}

                </ul>
              </div>
            </div>
          </div>
        )
      });

      return (
        <React.Fragment key={index}>
          <div className="row mt-2">
            <div className="col-md-6">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 pl-3">
                    {client.type === 'corporate' ?
                      <li>Корпоративный клиент: {client.name}</li> : ''}
                    {client.type === 'individual' ?
                      <React.Fragment>
                        <li>Физический клиент: {client.name}</li>
                        <li>Номер телефона: {client.phone}</li>
                        <li>Адрес: {client.address}</li>
                      </React.Fragment> : ''}
                    <li>Всего Получено заказов от клиента: {client.orders.length}</li>
                    <li>Выполнено и подтверждено заказов: {confirmedOrders.length}</li>
                    <li>Средняя оценка подтвержденных заказов: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                    <li>Общая Сумма подтвержденных заказов: {totalSum.toLocaleString()} UZS</li>
                  </ul>
                </div>
              </div>
            </div>
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