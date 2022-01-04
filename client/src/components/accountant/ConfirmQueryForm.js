import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';

import RenderOrder from '../common/RenderOrder';
import { getCompleteOrderById, accountantConfirmQuery } from '../../actions/accountantActions';


class ConfirmQueryForm extends Component {
  state = {
    query: {
      disinfectorId: {},
      userCreated: {},
      clientId: {},
      userAcceptedOrder: {},
      disinfectors: []
    },
    invoice: '',
    cost: ''
  };

  componentDidMount() {
    this.props.getCompleteOrderById(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountant.queryById) {
      this.setState({
        query: nextProps.accountant.queryById
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  confirm = (e) => {
    e.preventDefault();
    if (Number(this.state.cost) <= 0) {
      alert('Сумма заказа не может быть нулем или отрицательным числом');
    } else {
      const object = {
        decision: 'confirm',
        orderId: this.state.query._id,
        invoice: this.state.invoice,
        cost: Number(this.state.cost),
        disinfectors: this.state.query.disinfectors
      };
      this.props.accountantConfirmQuery(object, this.props.history);
    }
  }

  reject = (e) => {
    e.preventDefault();
    const object = {
      decision: 'reject',
      orderId: this.state.query._id,
      disinfectors: this.state.query.disinfectors
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  }

  returnBack = (e) => {
    e.preventDefault();
    const object = {
      decision: 'back',
      orderId: this.state.query._id,
      disinfectors: this.state.query.disinfectors
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  }

  render() {
    const { query } = this.state;

    return (
      <div className="container-fluid">
        <div className="row m-0">

          <div className="col-lg-6 col-md-7">
            {this.props.accountant.loadingQueries ? <Spinner /> : (
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0">
                    <RenderOrder
                      order={query}
                      shouldRenderIfOrderIsPovtor={false}
                      shouldRenderIfOrderIsFailed={false}
                      shouldRenderNextOrdersAfterFailArray={true}
                      shouldRenderDisinfector={true}
                      shouldRenderOperatorDecided={true}
                      shouldRenderAccountantDecided={false}
                      shouldRenderMaterialConsumption={true}
                      shouldRenderPaymentMethod={true}
                      shouldRenderUserAcceptedOrder={true}
                      shouldRenderUserCreated={true}
                      shouldRenderCompletedAt={true}
                    />
                  </ul>

                  <button className="btn btn-danger" onClick={this.reject}>Отменить Выполнение Заказа</button>
                  <button className="btn btn-dark ml-2" onClick={this.returnBack}>Отправить Обратно</button>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-6 col-md-5 mx-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body p-2">
                <h2 className="text-center">Форма Подтверждения Заказа</h2>
                <form onSubmit={this.confirm}>
                  <TextFieldGroup
                    label="Введите Счет-Фактуру:"
                    type="text"
                    name="invoice"
                    value={this.state.invoice}
                    onChange={this.onChange}
                    required
                  />
                  <TextFieldGroup
                    label="Введите сумму заказа (в сумах):"
                    type="number"
                    step="1"
                    name="cost"
                    value={this.state.cost}
                    onChange={this.onChange}
                    required
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
  accountant: state.accountant,
  errors: state.errors
});

export default connect(mapStateToProps, { getCompleteOrderById, accountantConfirmQuery })(withRouter(ConfirmQueryForm));