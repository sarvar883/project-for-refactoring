import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import ShowDisStats from './ShowDisStats';
import { getAllDisinfectorsAndSubadmins, getDisinfStatsDayForAdmin, getDisinfStatsWeekForAdmin, getDisinfStatsMonthForAdmin } from '../../actions/adminActions';
import monthsNames from '../../utils/monthsNames';
import getMonthAndYearLabels from '../../utils/getMonthAndYearLabels';

import { getWeekDays, getWeekRange } from '../../utils/weekPickerFunctions';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class DisStats extends Component {
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
    selectedDaysAfterSubmit: [],

    disinfectorIdMonth: '',
    disinfectorIdWeek: '',
    disinfectorIdDay: '',
    disinfectorName: '',
    occupation: ''
  };

  componentDidMount() {
    this.props.getAllDisinfectorsAndSubadmins();
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    this.props.admin.disinfectors.forEach(person => {
      if (person._id.toString() === this.state.disinfectorIdMonth.toString()) {
        this.setState({
          headingMonth: this.state.month,
          headingYear: this.state.year,
          disinfectorName: person.name,
          occupation: person.occupation
        });
      }
    });
    this.props.getDisinfStatsMonthForAdmin(this.state.disinfectorIdMonth, this.state.month, this.state.year);
  }

  getWeekStats = (e) => {
    e.preventDefault();
    if (this.state.selectedDays.length === 0) {
      alert('Вы не выбрали неделю');
    } else {
      this.props.admin.disinfectors.forEach(person => {
        if (person._id.toString() === this.state.disinfectorIdWeek.toString()) {
          this.setState({
            selectedDaysAfterSubmit: this.state.selectedDays,
            disinfectorName: person.name,
            occupation: person.occupation
          });
        }
      });
      this.props.getDisinfStatsWeekForAdmin(this.state.disinfectorIdWeek, this.state.selectedDays);
    }
  }

  getDayStats = (e) => {
    e.preventDefault();
    const object = {
      disinfectorId: this.state.disinfectorIdDay,
      day: this.state.day
    };

    this.props.admin.disinfectors.forEach(person => {
      if (person._id.toString() === this.state.disinfectorIdDay.toString()) {
        this.setState({
          headingDay: this.state.day.split('-').reverse().join('-'),
          disinfectorName: person.name,
          occupation: person.occupation
        });
      }
    });
    this.props.getDisinfStatsDayForAdmin(object);
  }


  // weekly calendar
  handleDayChange = date => {
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

    let disinfectorOptions = [{
      label: "-- Выберите Пользователя -- ", value: ""
    }];

    this.props.admin.disinfectors.forEach(person => {
      disinfectorOptions.push({
        label: `${person.occupation} ${person.name}`, value: person._id
      });
    });

    let renderDisinfectorOptions = disinfectorOptions.map((item, index) =>
      <option value={item.value} key={index}>{item.label}</option>
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
            <h4 className="text-center">Статистика по месяцам</h4>
            <form onSubmit={this.getMonthStats}>
              <div className="form-group">
                <label htmlFor="disinfectorIdMonth"><strong>Выберите Пользователя:</strong></label>
                <select name="disinfectorIdMonth" className="form-control" onChange={this.onChange} required>
                  {renderDisinfectorOptions}
                </select>
              </div>
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
            <h4 className="text-center">Статистика по дням</h4>
            <form onSubmit={this.getDayStats}>
              <div className="form-group">
                <label htmlFor="disinfectorIdDay"><strong>Выберите Пользователя:</strong></label>
                <select name="disinfectorIdDay" className="form-control" onChange={this.onChange} required>
                  {renderDisinfectorOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample">
              <h4 className="text-center">Статистика по неделям</h4>
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
            <form onSubmit={this.getWeekStats}>
              <div className="form-group">
                <label htmlFor="disinfectorIdWeek"><strong>Выберите Пользователя:</strong></label>
                <select name="disinfectorIdWeek" className="form-control" onChange={this.onChange} required>
                  {renderDisinfectorOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            {this.props.admin.method === 'week' && this.state.disinfectorName && this.state.selectedDays ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика {this.state.occupation} {this.state.disinfectorName} за <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[6]}</Moment></h2> : ''
            }

            {this.props.admin.method === 'month' && this.state.disinfectorName && this.state.month && this.state.year ?
              <h2 className="text-center pl-3 pr-3">Месячная Статистика {this.state.occupation}  {this.state.disinfectorName} за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.props.admin.method === 'day' && this.state.disinfectorName && this.state.day ?
              <h2 className="text-center pl-3 pr-3">Дневная Статистика {this.state.occupation}  {this.state.disinfectorName} за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowDisStats />}
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

export default connect(mapStateToProps, { getAllDisinfectorsAndSubadmins, getDisinfStatsDayForAdmin, getDisinfStatsWeekForAdmin, getDisinfStatsMonthForAdmin })(withRouter(DisStats));