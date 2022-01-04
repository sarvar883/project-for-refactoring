import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import RenderOrder from '../common/RenderOrder';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { getCompleteOrderById, confirmCompleteOrder } from '../../actions/operatorActions';


class ConfirmOrder extends Component {
  state = {
    clientReview: '',
    score: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getCompleteOrderById(this.props.match.params.id);
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
      orderId: this.props.operator.orderToConfirm._id,
      decision: 'confirm',
      clientReview: this.state.clientReview,
      score: this.state.score
    };
    this.props.confirmCompleteOrder(object, this.props.history);
  }

  reject = () => {
    const object = {
      orderId: this.props.operator.orderToConfirm._id,
      decision: 'reject',
      clientReview: '',
      score: ''
    };
    this.props.confirmCompleteOrder(object, this.props.history);
  }

  render() {
    const completeOrder = this.props.operator.orderToConfirm;
    const { errors } = this.state;

    return (
      <div className="container-fluid">
        <div className="row">
          {this.props.operator.loadingCompleteOrders ? <Spinner /> : (

            <div className="col-lg-6 col-md-9 mx-auto">
              <h2 className="text-center">Выполненный Заказ</h2>
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0">
                    <RenderOrder
                      order={completeOrder}
                      shouldRenderIfOrderIsPovtor={false}
                      shouldRenderIfOrderIsFailed={false}
                      shouldRenderNextOrdersAfterFailArray={false}
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

                  <button className="btn btn-danger" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.reject() } }}>Отменить Выполнение Заказа</button>
                </div>
              </div>
            </div>
          )}

          <div className="col-lg-6 col-md-9 mx-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body p-2">
                <h2 className="text-center">Форма Подтверждения Заказа</h2>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    label="Полученный Балл за Выполнение Заказа (0-5):"
                    type="number"
                    name="score"
                    min="0"
                    max="5"
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
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getCompleteOrderById, confirmCompleteOrder })(withRouter(ConfirmOrder));