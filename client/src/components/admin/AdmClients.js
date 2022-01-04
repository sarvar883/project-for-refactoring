import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import RenderOrder from '../common/RenderOrder';
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

        return (
          <div className="col-lg-4 col-md-6" key={key}>
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <RenderOrder
                    order={item}
                    shouldRenderIfOrderIsPovtor={false}
                    shouldRenderIfOrderIsFailed={false}
                    shouldRenderNextOrdersAfterFailArray={false}
                    shouldRenderDisinfector={true}
                    shouldRenderOperatorDecided={true}
                    shouldRenderAccountantDecided={true}
                    shouldRenderMaterialConsumption={true}
                    shouldRenderPaymentMethod={true}
                    shouldRenderUserAcceptedOrder={true}
                    shouldRenderUserCreated={true}
                    shouldRenderCompletedAt={true}
                  />
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