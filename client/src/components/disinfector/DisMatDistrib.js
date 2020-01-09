import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import moment from 'moment';

import ShowDisMatDistribs from './ShowDisMatDistribs';

import { getUserMatDistrib } from '../../actions/disinfectorActions';

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




class DisMatDistrib extends Component {
  state = {
    month: '',
    year: '',

    method: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const object = {
      userId: this.props.auth.user.id,
      type: 'month',
      month: thisMonth,
      year: thisYear
    };
    this.props.getUserMatDistrib(object);
    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear,
      method: 'month'
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();

    const object = {
      userId: this.props.auth.user.id,
      type: 'month',
      month: this.state.month,
      year: this.state.year
    };
    this.props.getUserMatDistrib(object);

    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year,
      method: 'month'
    });
  }



  // weekly calendar
  handleDayChange = date => {
    const object = {
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getUserMatDistrib(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from),
      method: 'week'
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
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekDays(getWeekRange(days[0]).from))
    };
    this.props.getUserMatDistrib(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from),
      method: 'week'
    });
  };
  // end of weekly calendar



  render() {
    const date = new Date();
    const monthsNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    let years = [
      { label: "-- Выберите Год -- ", value: "" }
    ];
    for (let i = 2019; i <= date.getFullYear(); i++) {
      years.push({
        label: i, value: i
      });
    }

    const months = [
      { label: "-- Выберите месяц -- ", value: "" },
      { label: "Январь", value: 0 },
      { label: "Февраль", value: 1 },
      { label: "Март", value: 2 },
      { label: "Апрель", value: 3 },
      { label: "Май", value: 4 },
      { label: "Июнь", value: 5 },
      { label: "Июль", value: 6 },
      { label: "Август", value: 7 },
      { label: "Сентябрь", value: 8 },
      { label: "Октябрь", value: 9 },
      { label: "Ноябрь", value: 10 },
      { label: "Декабрь", value: 11 }
    ];

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
          <div className="col-lg-4 col-md-6">
            <h3 className="text-center">Раздача Материалов по месяцам</h3>
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

          <div className="col-lg-4 col-md-6 ml-auto weekly-stats">
            <div className="SelectedWeekExample">
              <h3 className="text-center">Раздача Материалов по неделям</h3>
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
            {this.state.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Ваша Недельная Раздача Материалов за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Ваша Месячная Раздача Материалов за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.disinfector.loadingDisinfStats ? <Spinner /> : <ShowDisMatDistribs />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  disinfector: state.disinfector,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getUserMatDistrib })(withRouter(DisMatDistrib));