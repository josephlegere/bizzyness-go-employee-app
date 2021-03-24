import _ from 'lodash';
import moment from 'moment';
import { GET_ATTENDANCE, ATTENDANCE_DEFAULT, ATTENDANCE_ERROR } from '../types'

const initialState = {
    attendance: [],
    loading: true
}

export default function(state = initialState, action) {

    switch (action.type) {

        case GET_ATTENDANCE:
            let { attendance, daysoff } = action.payload;
            let _formatted = attendance_formatted({ attendance: attendance.list, daysoff });

            return {
                ...state,
                attendance: _formatted,
                loading: false

            }
        case ATTENDANCE_DEFAULT:
            
            return {
                ...initialState
            }
        case ATTENDANCE_ERROR:
            return {
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}

function attendance_formatted (data) {
    let { attendance, daysoff } = data;
    return attendance.map((elem) => {
        let _obj = {};
        
        let timings = _.cloneDeep(elem.timings);
        let _len = 3;
        let timing_sets = {
            day: [],
            noon: [],
            day_min: [],// min => minimum
            noon_min: []
        };
        let locations = '';
        let _set = {};// temporary store for partial sets
        let _set_location = { in: '', out: '' };
        let count = 0;

        do {
            let timing = timings[count];
            let _datetime = moment(timing.input).format('YYYY-MM-DD HH:mm:ss.SS');
            let _loc_regex = new RegExp(timing.place.replace(/[^a-zA-Z ]/g, ''), 'i');
            // .replace(/[^a-zA-Z ]/g, '') <- this code now enables comparison of strings even with special char
            // it removes special char from string, which made it not compare strings because it messes up with the regex
            // i.e. "(example) string" can't be compared, so avoiding repeated texts wouldn't work

            // console.log(_time)
            // console.log(timing)

            if (Object.keys(_set).length === 0) {
                _set[(timing.type === 0 ? 'in' : 'out')] = _datetime;

                if ((locations.replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1)
                    _set_location[(timing.type === 0 ? 'in' : 'out')] = (timing.place.replace(/\s/g, '') !== '' ? timing.place : '');

                // reset variables
                timings.splice(0, 1);
                count = 0;
            }
            else if (Object.keys(_set)[0] !== (timing.type === 0 ? 'in' : 'out')) {// assuming the length of "set" is 1
                _set[(timing.type === 0 ? 'in' : 'out')] = _datetime;

                if ((locations.replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1 && (Object.values(_set_location)[0].replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1)
                    _set_location[(timing.type === 0 ? 'in' : 'out')] = (timing.place.replace(/\s/g, '') !== '' ? timing.place : '');

                // input the work locations
                _set.location = `${_set_location.in}${(_set_location.in !== '' && _set_location.out !== '' ? ', ' : '')}${_set_location.out}`;

                // reset variables
                timings.splice(0, 1);
                count = 0;
            }
            else {
                count++;
            }

            // before continuing the set should have the requirments
            // "in" & "out" variables or else it moves on to the next loop
            if (Object.keys(_set).length < 2) continue;
            
            // console.log(_set)
            let _set_collection = [];

            // checks if "in" is morning and "out" is afternoon
            if (moment(_set.in.substr(11), 'h:mma').isBefore(moment('12:00pm', 'h:mma')) && moment(_set.out.substr(11), 'h:mma').isAfter(moment('12:00pm', 'h:mma'))) {
                _set_collection.push({
                    in: _set.in,
                    out: `${_set.in.substr(0, 10)} 12:00:00.00`,
                    location: _set.location
                });
                _set_collection.push({
                    in: `${_set.out.substr(0, 10)} 12:00:00.00`,
                    out: _set.out,
                    location: ''
                });
            }
            else {
                _set_collection.push({
                    in: _set.in,
                    out: _set.out,
                    location: _set.location
                });
            }

            // Timing formats: 05:30 PM => h:mma, 17:00:00 => HH:mm:ss
            _set_collection.forEach(_set_item => {
                // if (moment(_time, 'h:mma').isBefore(moment('12:00pm', 'h:mma')) || (moment(_time, 'h:mma').isSame(moment('12:00pm', 'h:mma')) && timing.type === 1)) {
                if (moment(_set_item.in.substr(11), 'h:mma').isBefore(moment('12:00pm', 'h:mma'))) {// day schedule

                    timing_sets.day.push(_set_item);
                    timing_sets.day_min.push(`${moment(_set_item.in).format('h:mma')} - ${moment(_set_item.out).format('h:mma')}`);
                    
                    locations += (_set_item.location.replace(/\s/g, '') !== '' ? (locations !== '' ? ', ' : '') + _set_item.location : '');
                    
                    // console.log('day');
                }
                else {// noon schedule

                    timing_sets.noon.push(_set_item);
                    timing_sets.noon_min.push(`${moment(_set_item.in).format('h:mma')} - ${moment(_set_item.out).format('h:mma')}`);
                    
                    locations += (_set_item.location.replace(/\s/g, '') !== '' ? (locations !== '' ? ', ' : '') + _set_item.location : '');

                    // console.log('noon');
                }
                // console.log(timing_sets);
            });

            // reset variables
            _set = {};
            _set_location = { in: '', out: '' };
            
            // console.log(timings.length);

        } while(timings.length > 0);

        // calculate overtime
        // console.log(timing_sets)
        let workHours = 8;
        let hrTotal = 0;
        let overtime_init = false;// if overtime was already triggered / it was already indicated that there was overtime
        let overtime_timings = { in: '', out: '' };
        overtime_timings.list = [];
        
        // determine if its a weekend
        if (daysoff.some(_day => _day.num === moment((elem.timings[0].input).substr(0, 10)).day())) hrTotal += 8;
        else if (elem.hasOwnProperty('special_date')) {
            let { type, hours } = elem.special_date;
            if (type === 'holiday') hrTotal += 8;
            else if (type === 'specialtiming') hrTotal += 6;
        }
        
        // DON'T INCLUDE ANY CONDITION IF TIMING LIST HAS LENGTH GREATER THAN 0
        // loop through each sets then accumulate the work hours to a "variable" to determine attendance status
        // check if overtime starts here in "morning"
        timing_sets.day.forEach(timing => {
            // console.log(moment(timing.out).diff(moment(timing.in), 'hours', true))

            let hrs_to_complete_work = workHours - hrTotal;
            hrTotal += moment(timing.out).diff(moment(timing.in), 'hours', true);

            if (hrTotal > workHours) {// try to figure out which part the OT started
                let _in = moment(timing.in).format('hh:mm A');
                let _out = moment(timing.out).format('hh:mm A');

                if (!overtime_init) {// goes here only once, when overtime_init is still false
                    overtime_init = true;
                    _in = moment(timing.in).add(hrs_to_complete_work, 'hours').format('hh:mm A');
                    overtime_timings.in = _in;

                    // determines if noon has timings,
                    // if not it already assumes that last timing in "day" is overtime out
                    if (timing_sets.noon.length > 0) {
                        overtime_timings.out = moment(timing_sets.noon[timing_sets.noon.length - 1].out).format('h:mma');
                    }
                    else {
                        overtime_timings.out = moment(timing_sets.day[timing_sets.day.length - 1].out).format('h:mma');
                    }
                }

                // Collection of all Overtime Entry
                overtime_timings.list.push(`${_in} - ${_out}`);

            }
        });

        // check if overtime starts here in "noon"
        timing_sets.noon.forEach(timing => {
            // console.log(moment(timing.out).diff(moment(timing.in), 'hours', true))
            let hrs_to_complete_work = workHours - hrTotal;
            hrTotal += moment(timing.out).diff(moment(timing.in), 'hours', true);

            if (hrTotal > workHours) {// try to figure out which part the OT started
                let _in = moment(timing.in).format('hh:mm A');
                let _out = moment(timing.out).format('hh:mm A');
            
                if (!overtime_init) {// goes here only once, when overtime_init is still false
                    overtime_init = true;
                    _in = moment(timing.in).add(hrs_to_complete_work, 'hours').format('hh:mm A');
                    overtime_timings.in = _in;

                    overtime_timings.out = moment(timing_sets.noon[timing_sets.noon.length - 1].out).format('hh:mm A');
                }

                // Collection of all Overtime Entry
                overtime_timings.list.push(`${_in} - ${_out}`);
                
            }
        });
        
        // _obj['uniqueid'] = elem.employee.id;
        // _obj['employee'] = elem.employee.name;

        _obj['timings'] = timing_sets;

        // _obj['ottimings'] = `${overtime_timings.in}${(overtime_timings.in !== '' && overtime_timings.out !== '' ? ' - ' : '')}${overtime_timings.out}`;
        _obj['ottimings'] = overtime_timings.list;
        _obj['othours'] = (hrTotal <= workHours ? '' : hrTotal - workHours);
        _obj['workstatus'] = (hrTotal >= workHours ? ( hrTotal > workHours ? 'OT' : 'REG') : 'INC');// specify attendance status: 'OVERTIME', 'REGULAR', 'UNDERTIME'

        _obj['locations'] = locations;
        _obj['verify'] = elem.status;

        _obj['date'] = (elem.timings[0].input).substr(0, 10);
        _obj['daytype'] = (() => {
            if (daysoff.some(_day => _day.num === moment((elem.timings[0].input).substr(0, 10)).day())) return 'Weekend';
            else if (elem.hasOwnProperty('special_date')) return elem.special_date.name;
            return 'Work Day';
        })();

        return _obj;
    });
}