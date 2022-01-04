import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import RenderOrder from '../common/RenderOrder';
import { clientById } from '../../actions/adminActions';


class ClientId extends Component {
  state = {
    client: {
      orders: []
    }
  };

  componentDidMount() {
    this.props.clientById(this.props.match.params.clientId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.clientById) {
      this.setState({
        client: nextProps.admin.clientById
      });
    }
  }

  render() {
    const { client } = this.state;

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
      <div className="container-fluid">

        {this.props.admin.loadingClients ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Клиент {client.name}</h3>
              </div>
            </div>

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

            <div className="row mt-2 pb-1">
              {clientOrders}
            </div>
          </React.Fragment>
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

export default connect(mapStateToProps, { clientById })(withRouter(ClientId));