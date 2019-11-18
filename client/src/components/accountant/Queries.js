import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getAccountantQueries } from '../../actions/accountantActions';

class Queries extends Component {
  state = {
    queries: []
  };

  componentDidMount() {
    this.props.getAccountantQueries();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountant.queries) {
      this.setState({
        queries: nextProps.accountant.queries
      });
    }
  }

  render() {
    const { queries } = this.state;

    let renderQueries = queries.map((item, key) => {
      let consumptionArray = [];
      item.disinfectors.forEach(element => {
        consumptionArray.push({
          user: element.user,
          consumption: element.consumption
        });
      });

      let consumptionRender = consumptionArray.map((object, index) =>
        <li key={index}>
          <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
          {object.consumption.map((element, number) =>
            <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
          )}
        </li>
      );

      return (
        <div className="col-lg-4 col-md-6 mt-2" key={key}>
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

                <li>Номер Договора: {item.contractNumber}</li>
                <li>Корпоративный Клиент: {item.clientId.name}</li>
                <li>Имя клиента: {item.client}</li>
                <li>Телефон Клиента: {item.phone}</li>
                {item.phone2 ? <li>Другой номер: {item.phone2}</li> : ''}
                <li>Адрес: {item.address}</li>
                <li>Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                <li>Комментарии Оператора: {item.comment ? item.comment : 'Нет комментариев'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : 'Нет комментариев'}</li>

                <li>Расход Материалов (заказ выполнили {item.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>

                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{item.completedAt}</Moment></li>
              </ul>

              <Link to={`/accountant/order-confirm/${item._id}`} className="btn btn-dark">Форма Подтверждения</Link>
            </div>
          </div>
        </div>
      );
    });


    return (
      <div className="container-fluid">
        <div className="row m-0">
          <h2 className="m-auto">Запросы</h2>
        </div>

        <div className="row m-0">
          {this.props.accountant.loadingQueries ?
            <div className="col-12">
              <Spinner />
            </div>
            :
            renderQueries
          }
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

export default connect(mapStateToProps, { getAccountantQueries })(withRouter(Queries));