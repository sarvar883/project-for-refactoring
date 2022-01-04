import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getAllDisinfectors, getSubMatDistrib } from '../../actions/subadminActions';
import ShowMatDistrib from './ShowMatDistrib';

import { getWeekDays, getWeekRange } from '../../utils/weekPickerFunctions';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class MatDistribHistory extends Component {
  state = {
    month: '',
    year: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentDidMount() {
    const object = {
      type: 'month',
      subadmin: this.props.auth.user.id,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
    this.props.getSubMatDistrib(object);
    this.props.getAllDisinfectors();
    this.setState({
      headingMonth: object.month,
      headingYear: object.year
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    const object = {
      type: 'month',
      subadmin: this.props.auth.user.id,
      month: Number(this.state.month),
      year: Number(this.state.year),
    };
    this.props.getSubMatDistrib(object);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }



  // weekly calendar
  handleDayChange = date => {
    const object = {
      type: 'week',
      subadmin: this.props.auth.user.id,
      days: getWeekDays(getWeekRange(date).from)
    }
    this.props.getSubMatDistrib(object);
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
      type: 'week',
      subadmin: this.props.auth.user.id,
      days: getWeekDays(getWeekRange(days[0]).from)
    }
    this.props.getSubMatDistrib(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
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
            <h2 className="text-center">Раздача Материалов по месяцам</h2>
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
              <h2 className="text-center">Раздача Материалов по неделям</h2>
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
            {this.props.subadmin.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельная Раздача Материалов за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Месячная Раздача Материалов за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.subadmin.loadingStats ? <Spinner /> : <ShowMatDistrib />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllDisinfectors, getSubMatDistrib })(withRouter(MatDistribHistory));