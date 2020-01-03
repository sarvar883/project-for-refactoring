import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import TextFieldGroup from '../common/TextFieldGroup';

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
      };
      this.props.accountantConfirmQuery(object, this.props.history);
    }
  }

  reject = (e) => {
    e.preventDefault();
    const object = {
      decision: 'reject',
      orderId: this.state.query._id
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  }

  render() {
    const { query } = this.state;

    let consumptionArray = [];
    if (query.disinfectors) {
      query.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });
    }

    let consumptionRender = consumptionArray.map((item, index) =>
      <li key={index}>
        <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
        {item.consumption.map((element, number) =>
          <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
        )}
      </li>
    );

    return (
      <div className="container-fluid">
        <div className="row m-0">

          <div className="col-lg-6 col-md-7">
            {this.props.accountant.loadingQueries ? <Spinner /> : (
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0">
                    <li>Ответственный: {query.disinfectorId.occupation} {query.disinfectorId.name}</li>

                    {query.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку</li>
                        {query.operatorConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{query.operatorCheckedAt}</Moment>)</li>
                            <li>Балл (0-5): {query.score}</li>
                            <li>Отзыв Клиента: {query.clientReview ? query.clientReview : 'Нет Отзыва'}</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{query.operatorCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : <li>Оператор еще не рассмотрел заявку</li>}

                    {query.clientId ? (
                      <li>Корпоративный Клиент: {query.clientId.name}</li>
                    ) : <li>Корпоративный Клиент</li>}

                    <li>Имя клиента: {query.client}</li>

                    <li>Телефон клиента: {query.phone}</li>
                    {query.phone2 !== '' ? <li>Запасной номер: {query.phone2}</li> : ''}
                    <li>Дата: <Moment format="DD/MM/YYYY">{query.dateFrom}</Moment></li>
                    <li>Время выполнения: С <Moment format="HH:mm">{query.dateFrom}</Moment> ПО <Moment format="HH:mm">{query.completedAt}</Moment></li>
                    <li>Адрес: {query.address}</li>
                    <li>Тип услуги: {query.typeOfService}</li>
                    <li>Комментарии Оператора: {query.comment ? query.comment : 'Нет комментариев'}</li>
                    <li>Комментарии Дезинфектора: {query.disinfectorComment ? query.disinfectorComment : 'Нет комментариев'}</li>

                    <li>Расход Материалов (заказ выполнили {query.disinfectors.length} чел):</li>
                    <ul className="font-bold mb-0">
                      {consumptionRender}
                    </ul>

                    <li>Номер Договора: {query.contractNumber}</li>

                    {query.userAcceptedOrder ? (
                      <li>Заказ принял: {query.userAcceptedOrder.occupation} {query.userAcceptedOrder.name}</li>
                    ) : ''}

                    <li>Заказ добавил: {query.userCreated.occupation} {query.userCreated.name}</li>
                    <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{query.completedAt}</Moment></li>
                  </ul>
                  <button className="btn btn-danger" onClick={this.reject}>Отменить Выполнение Заказа</button>
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