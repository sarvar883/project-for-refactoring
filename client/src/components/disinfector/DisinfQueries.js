import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import CompleteOrdersInMonth from './CompleteOrdersInMonth';
import { getCompleteOrdersInMonth } from '../../actions/orderActions';
import monthsNames from '../../utils/monthsNames';
import getMonthAndYearLabels from '../../utils/getMonthAndYearLabels';


class DisinfQueries extends Component {
  state = {
    month: '',
    year: '',

    // to display month and year in heading h2
    headingMonth: '',
    headingYear: ''
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const disinfectorId = this.props.auth.user.id;
    this.props.getCompleteOrdersInMonth(thisMonth, thisYear, disinfectorId);
    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    this.props.getCompleteOrdersInMonth(this.state.month, this.state.year, this.props.auth.user.id);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  render() {
    const { monthLabels, yearLabels } = getMonthAndYearLabels();

    const yearsOptions = yearLabels.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = monthLabels.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Ваши Отправленные Запросы за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-7 col-sm-10 mx-auto">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="year"><strong>Выберите Год:</strong></label>
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="month"><strong>Выберите Месяц:</strong></label>
                <select name="month" className="form-control" onChange={this.onChange} required>
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>
          <div className="col-lg-9 pl-0 pr-0">
            {this.props.order.loading ? <Spinner /> : <CompleteOrdersInMonth />}
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

export default connect(mapStateToProps, { getCompleteOrdersInMonth })(withRouter(DisinfQueries));