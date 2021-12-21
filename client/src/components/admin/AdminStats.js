import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import moment from 'moment';
import axios from 'axios';

import { getDayStatsForAdmin, getMonthStatsForAdmin, getWeekStatsForAdmin } from '../../actions/adminActions';
import ShowAdminStats from './ShowAdminStats';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';



function getWeekDays(weekStart) {
  const days = [];
  for (let i = 1; i < 8; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date)
      .startOf('week')
      .toDate(),
    to: moment(date)
      .endOf('week')
      .toDate(),
  };
}



class AdminStats extends Component {
  state = {
    month: '',
    year: '',
    day: '',

    // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',
    headingDay: '',

    hoverRange: undefined,
    selectedDays: [],

    orders: [],
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const URL = 'http://localhost:5000';

    this.props.getMonthStatsForAdmin(thisMonth, thisYear);
    // axios.post(`${URL}/stats/for-admin-month`, { month: thisMonth, year: thisYear })
    //   .then(res => {
    //     this.setState({
    //       headingMonth: thisMonth,
    //       headingYear: thisYear,
    //       orders: res.data,
    //     });
    //   });

    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear,
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    this.props.getMonthStatsForAdmin(this.state.month, this.state.year);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  getDayStats = (e) => {
    e.preventDefault();
    this.props.getDayStatsForAdmin(this.state.day);
    this.setState({
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  }


  // weekly calendar
  handleDayChange = date => {
    this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(date).from));
    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from)
    });
  };

  handleDayEnter = date => {
    this.setState({
      hoverRange: getWeekRange(date)
    });
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined
    });
  };

  handleWeekClick = (weekNumber, days, e) => {
    this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(days[0]).from));
    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
    });
  };
  // end of weekly calendar



  render() {
    const date = new Date();
    const monthsNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const months = [
      { label: "-- Выберите месяц -- ", value: "" }
    ];
    monthsNames.forEach((month, i) => {
      months.push({
        label: month, value: i
      });
    });

    let years = [
      { label: "-- Выберите Год -- ", value: "" }
    ];
    for (let i = 2019; i <= date.getFullYear(); i++) {
      years.push({
        label: i, value: i
      });
    }

    const yearsOptions = years.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = months.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );


    // weekly calender
    const { hoverRange, selectedDays } = this.state;

    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6]
    };
    // end of calendar


    return (
      <div className="container-fluid" >
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-3">
            <h2 className="text-center">Статистика по месяцам</h2>
            <form onSubmit={this.getMonthStats}>
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


          <div className="col-lg-4 col-md-6 mt-3">
            <h2 className="text-center">Статистика по дням</h2>
            <form onSubmit={this.getDayStats}>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample">
              <h2 className="text-center">Статистика по неделям</h2>
              <DayPicker
                selectedDays={selectedDays}
                showWeekNumbers
                showOutsideDays
                modifiers={modifiers}
                firstDayOfWeek={1}
                onDayClick={this.handleDayChange}
                onDayMouseEnter={this.handleDayEnter}
                onDayMouseLeave={this.handleDayLeave}
                onWeekClick={this.handleWeekClick}
              />
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            {this.props.admin.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.props.admin.method === 'month' ?
              <h2 className="text-center pl-3 pr-3">Месячная Статистика за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.props.admin.method === 'day' ?
              <h2 className="text-center pl-3 pr-3">Дневная Статистика за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowAdminStats />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getDayStatsForAdmin, getMonthStatsForAdmin, getWeekStatsForAdmin })(withRouter(AdminStats));