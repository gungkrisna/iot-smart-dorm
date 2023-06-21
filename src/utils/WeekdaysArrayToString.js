import moment from 'moment';

const WeekdaysArrayToString = (weekdays, isShortForm) => {
    moment.locale('en');

    const weekdaysNames = weekdays.map(day => moment().isoWeekday(parseInt(day)).format(isShortForm ? 'ddd' : 'dddd'));
    return weekdaysNames.join(', ');
};

export default WeekdaysArrayToString;