import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import RenderOrder from '../common/RenderOrder';
import TextFieldGroup from '../common/TextFieldGroup';
import { searchOrders } from '../../actions/orderActions';


class SearchOrders extends Component {
  state = {
    phone: '',
    address: '',
    contractNumber: '',
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

  searchByContract = (e) => {
    e.preventDefault();
    this.setState({
      method: 'contract',
      headingText: this.state.contractNumber
    });
    const object = {
      method: 'contract',
      payload: this.state.contractNumber
    };
    this.props.searchOrders(object);
  };

  render() {
    let renderOrders = this.state.orders.map((item, index) => {
      return (
        <div className="col-lg-4 col-md-6" key={index}>
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
          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByContract} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по номеру договора</h4>
              <TextFieldGroup
                type="text"
                placeholder="Номер Договора"
                name="contractNumber"
                value={this.state.contractNumber}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {this.state.method === 'phone' ? <h2 className="text-center">Результаты поиска заказов по номеру телефона "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'address' ? <h2 className="text-center">Результаты поиска заказов по адресу "{this.state.headingText}"</h2> : ''}
            {this.state.method === 'contract' ? <h2 className="text-center">Результаты поиска заказов по номеру договора "{this.state.headingText}"</h2> : ''}
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