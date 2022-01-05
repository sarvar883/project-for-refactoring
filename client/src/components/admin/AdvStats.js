import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../common/Spinner';
import advertisements from '../common/advertisements';
import calculateStats from '../../utils/calcStats';
import getMonthAndYearLabels from '../../utils/getMonthAndYearLabels';
import { getAdvStats } from '../../actions/adminActions';


class AdvStats extends Component {
  state = {
    type: '',
    month: '',
    year: '',
    orders: [],

    // to display month and year in heading
    headingMonth: '',
    headingYear: ''
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    this.setState({
      type: 'month',
      month: thisMonth,
      year: thisYear,
      headingMonth: thisMonth,
      headingYear: thisYear,
    });

    const object = {
      type: 'month',
      month: thisMonth,
      year: thisYear
    };
    this.props.getAdvStats(object);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orders: nextProps.admin.stats.orders
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  allTimeStats = () => {
    this.setState({
      type: 'allTime',
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
    const object = {
      type: 'allTime',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAdvStats(object);
  }

  getMonthStats = (e) => {
    e.preventDefault();
    this.setState({
      type: 'month',
      headingMonth: Number(this.state.month),
      headingYear: Number(this.state.year)
    });
    const object = {
      type: 'month',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAdvStats(object);
  }

  getYearStats = (e) => {
    e.preventDefault();
    this.setState({
      type: 'year',
      headingYear: Number(this.state.year)
    });
    const object = {
      type: 'year',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAdvStats(object);
  }

  render() {
    const { monthLabels, yearLabels } = getMonthAndYearLabels();

    const yearsOptions = yearLabels.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = monthLabels.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );

    // advertisingObject looke like this: 
    // {
    //   [advertising name]: array of orders,
    //   google: [],
    //   facebook: [],
    //   ...
    // }
    const advertisingObject = {};
    advertisements.forEach(item => {
      advertisingObject[item.value] = [];
    });

    this.state.orders.forEach(order => {
      advertisingObject[order.advertising].push(order);
    });

    const advertisingStats = [];
    for (let key in advertisingObject) {
      let currentOrders = advertisingObject[key];

      // calculate stats of orders for this advertising
      let currentStats = calculateStats(currentOrders);

      advertisingStats.push({
        advertising: key,
        stats: currentStats
      });
    }

    // sort advertising by the number of incoming orders
    advertisingStats.sort((a, b) => b.stats.totalOrders - a.stats.totalOrders);


    let renderAdvGeneral = advertisingStats.map((item, index) => {
      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h3 className="text-center">{item.advertising}</h3>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Получено заказов: {item.stats.totalOrders}</li>
                <li>Выполнено заказов: {item.stats.completed}</li>
                <li>Админ поставил оценку на {item.stats.howManyOrdersHaveAdminGrades} заказа(ов)</li>
                <li>Подтверждено заказов: {item.stats.confirmedOrders.length}</li>

                <li className="pt-2">На общую сумму: {item.stats.totalSum.toLocaleString()} UZS</li>
                <li>Средний балл: {averageScore.toFixed(2)} (из 5)</li>
                <li className="pb-2">Средняя оценка админа: {item.stats.averageAdminGrade} (из 10)</li>

                <li>Отвергнуто заказов: {item.stats.rejected}</li>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="container-fluid mt-1 p-0">
        <div className="row m-0 p-0">
          <div className="col-lg-4 col-md-6">
            <form onSubmit={this.getMonthStats}>
              <div className="form-group">
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <div className="form-group">
                <select name="month" className="form-control" onChange={this.onChange} required>
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-block btn-success">Показать месячную статистику</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getYearStats}>
              <div className="form-group">
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-block btn-info">Показать годовую статистику</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-3">
            <button onClick={this.allTimeStats} className="btn btn-block btn-dark">Показать статистику за все время</button>
          </div>
        </div>

        <div className="row m-0">
          <div className="col-12 mt-3">
            {this.state.type === 'month' ? <h2 className="text-center">Статистика рекламы за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}
            {this.state.type === 'year' ? <h2 className="text-center">Статистика рекламы за {this.state.headingYear} год</h2> : ''}
            {this.state.type === 'allTime' ? <h2 className="text-center">Статистика рекламы за все время</h2> : ''}
          </div>
        </div>

        {this.props.admin.loadingStats ? <Spinner /> : (
          <div className="row m-0">
            {renderAdvGeneral}
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

export default connect(mapStateToProps, { getAdvStats })(withRouter(AdvStats));