import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getAccStats } from '../../actions/accountantActions';
import monthsNames from '../../utils/monthsNames';
import getMonthAndYearLabels from '../../utils/getMonthAndYearLabels';
import ShowAccStats from './ShowAccStats';

import { getWeekDays, getWeekRange } from '../../utils/weekPickerFunctions';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class AccStats extends Component {
  state = {
    month: '',
    year: '',
    day: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',
    headingDay: '',

    hoverRange: undefined,
    selectedDays: [],
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const object = {
      accountantId: this.props.auth.user.id,
      type: 'month',
      month: thisMonth,
      year: thisYear
    };
    this.props.getAccStats(object);
    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    const object = {
      accountantId: this.props.auth.user.id,
      type: 'month',
      month: this.state.month,
      year: this.state.year
    };
    this.props.getAccStats(object);

    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  getDayStats = (e) => {
    e.preventDefault();
    const object = {
      accountantId: this.props.auth.user.id,
      type: 'day',
      day: this.state.day
    };
    this.props.getAccStats(object);

    this.setState({
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  }


  // weekly calendar
  handleDayChange = date => {
    const object = {
      accountantId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getAccStats(object);

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
    const object = {
      accountantId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };
    this.props.getAccStats(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
    });
  };
  // end of weekly calendar



  render() {
    const { monthLabels, yearLabels } = getMonthAndYearLabels();

    const yearsOptions = yearLabels.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = monthLabels.map((month, index) =>
      <option data-testid="month-options" value={month.value} key={index}>{month.label}</option>
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6">
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
                <select name="month"
                  data-testid="month-input"
                  className="form-control"
                  onChange={this.onChange}
                  required
                >
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6">
            <h2 className="text-center">Статистика по дням</h2>
            <form onSubmit={this.getDayStats}>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 weekly-stats">
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
            {this.props.accountant.stats.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Месячная Статистика за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.accountant.loadingStats ? <Spinner /> : <ShowAccStats />}
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

export default connect(mapStateToProps, { getAccStats })(withRouter(AccStats));