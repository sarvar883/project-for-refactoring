import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import ShowMatComingHistory from './ShowMatComingHistory';

import { getMatComMonth, getMatComWeek, getAllDisinfectorsAndSubadmins } from '../../actions/adminActions';
import monthsNames from '../../utils/monthsNames';
import getMonthAndYearLabels from '../../utils/getMonthAndYearLabels';

import { getWeekDays, getWeekRange } from '../../utils/weekPickerFunctions';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class MatComHistory extends Component {
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
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    this.props.getMatComMonth(thisMonth, thisYear);
    this.props.getAllDisinfectorsAndSubadmins();
    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    this.props.getMatComMonth(this.state.month, this.state.year);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }



  // weekly calendar
  handleDayChange = date => {
    this.props.getMatComWeek(getWeekDays(getWeekRange(date).from));
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
    this.props.getMatComWeek(getWeekDays(getWeekRange(days[0]).from));
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
            <h2 className="text-center">Приход Материалов по месяцам</h2>
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
              <h2 className="text-center">Приход Материалов по неделям</h2>
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
            {this.props.admin.addMatEventsMethod === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельный Приход Материалов за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Месячный Приход Материалов за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowMatComingHistory />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getMatComMonth, getMatComWeek, getAllDisinfectorsAndSubadmins })(withRouter(MatComHistory));