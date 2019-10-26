import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getRepeatOrders, repeatOrderNotNeeded } from '../../actions/operatorActions';

class RepeatOrders extends Component {
  state = {
    repeatOrders: []
  };

  componentDidMount() {
    this.props.getRepeatOrders(this.props.auth.user.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      repeatOrders: nextProps.operator.repeatOrders
    });
  }

  noNeed = (id) => {
    this.props.repeatOrderNotNeeded(id, this.props.history, this.props.auth.user.occupation);
  }

  render() {
    let renderOrders = this.state.repeatOrders.map((item, index) => {
      let consumptionRender;
      if (item.consumption) {
        consumptionRender = item.previousOrder.consumption.map((item, index) =>
          <li key={index}>{item.material} : {item.amount} {item.unit}</li>
        );
      }

      return (
        <React.Fragment key={index}>
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Дезинфектор: {item.disinfectorId.name}</li>
                  <li>Клиент: {item.client}</li>
                  <li>Телефон: {item.phone}</li>
                  {item.phone2 && item.phone2 !== '' ? <li>Запасной номер: {item.phone2}</li> : ''}
                  <li>Адрес: {item.address}</li>
                  <li>Тип услуги: {item.typeOfService}</li>
                  <li>Дата предыдущего заказа: <Moment format="DD/MM/YYYY">{item.previousOrder.dateFrom}</Moment></li>
                  <li>Срок гарантии (в месяцах): {item.previousOrder.guarantee}</li>
                  <li>Срок гарантии истекает: <Moment format="DD/MM/YYYY">{item.timeOfRepeat}</Moment></li>
                </ul>
                <button type="button" className="btn btn-primary mt-2" data-toggle="modal" data-target={`#info${index}`}>Полная информация о предыдущем заказе</button>
                <Link to={`/create-repeat-order-form/${item._id}`} className="btn btn-success mt-2">Повторная работа нужна</Link>
                <button className="btn btn-danger mt-2" onClick={() => { if (window.confirm('Вы  уверены?')) return this.noNeed(item._id) }}>Повторная работа не нужна</button>
              </div>
            </div>
          </div>

          <div className="modal fade" id={`info${index}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <ul className="font-bold mb-0 list-unstyled">
                    <li>Дезинфектор: {item.disinfectorId.name}</li>
                    <li>Клиент: {item.client}</li>
                    <li>Телефон: {item.phone}</li>
                    {item.phone2 && item.phone2 !== '' ? <li>Запасной номер: {item.phone2}</li> : ''}
                    <li>Адрес: {item.address}</li>
                    <li>Откуда узнали: {item.advertising}</li>
                    <li>Тип услуги: {item.typeOfService}</li>
                    <li>Дата: <Moment format="DD/MM/YYYY">{item.previousOrder.dateFrom}</Moment></li>
                    <li>Время выполнения: С <Moment format="HH:mm">{item.previousOrder.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.previousOrder.completedAt}</Moment></li>
                    <li>Срок гарантии (в месяцах): {item.previousOrder.guarantee}</li>
                    <li>Комментарии: {item.previousOrder.comment ? item.previousOrder.comment : '--'}</li>
                    <li>Комментарии Дезинфектора: {item.previousOrder.disinfectorComment ? item.previousOrder.disinfectorComment : '--'}</li>
                    <li>Расход Материалов:</li>
                    <ul className="font-bold mb-0">
                      {consumptionRender}
                    </ul>
                    <li>Тип Платежа: {item.previousOrder.paymentMethod}</li>
                    {item.previousOrder.paymentMethod === 'Безналичный' ? <li>Счет-Фактура: {item.previousOrder.invoice}</li> : ''}
                    <li>Общая Сумма: {item.previousOrder.cost ? item.previousOrder.cost.toLocaleString() : ''} UZS</li>

                    {item.previousOrder.completed && item.previousOrder.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.operatorCheckedAt}</Moment>)</li>
                        {item.previousOrder.operatorConfirmed ? <li className="text-success">Оператор подтвердил заяку</li> : <li className="text-danger">Оператор отверг заяку</li>}
                        <li>Балл: {item.previousOrder.score}</li>
                        <li>Отзыв Клиента: {item.previousOrder.clientReview}</li>
                      </React.Fragment>
                    ) : <li>Оператор еще рассмотрел заявку</li>}

                    {item.previousOrder.completed && item.previousOrder.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.adminCheckedAt}</Moment>)</li>
                        {item.previousOrder.adminConfirmed ? <li className="text-success">Админ подтвердил заяку</li> : <li className="text-danger">Админ отверг заяку</li>}
                      </React.Fragment>
                    ) : ''}
                  </ul>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Повторные заказы</h2>
          </div>
        </div>

        {this.props.operator.loadingSortedOrders ? <Spinner /> : (
          <div className="row">
            {renderOrders}
          </div>
        )}
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

export default connect(mapStateToProps, { getRepeatOrders, repeatOrderNotNeeded })(withRouter(RepeatOrders));