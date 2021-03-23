import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Icon, NavBar, Text, Toast } from 'galio-framework';
import moment from 'moment';

import firestore from '@react-native-firebase/firestore';

import DateTimeSelector from '../components/DateTimeSelector';
import AttendItemSet from '../components/AttendItemSet';
import theme from '../assets/theme';

import { addAttendance } from '../store/actions/attendance';

const { height, width } = Dimensions.get('window');

export default function AttendanceAdd({ navigation }) {

	const dispatch = useDispatch();
    const { tenant } = useSelector(state => state.tenantData);
    const { user: user_store } = useSelector(state => state.userData);
    
    const [ dayType, setDayType ] = useState('Work Day');
    const [ date, setDate ] = useState(moment().toDate());
    const [ timings, setTimings ] = useState([
        { in: '05:30:00', out: '12:00:00', location: '', tags: ['Morning'] },
        { in: '16:00:00', out: '17:30:00', location: '', tags: ['Afternoon'] }
    ]);
    // tags are important information of the attend / timing object, e.g. Morning, Afternoon, Overtime, indicating that if the object is morning or has reach overtime
    const [ specialDates, setSpecialDates ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ isSuccess, setSuccess ] = useState(false);
    const [ isFailure, setFailure ] = useState(false);

    const requiredHours = 8;

    useEffect(() => {

        async function getSpecialDates () {

            let tenantid = tenant.tenantid.split('/')[1];
            let _specialDates = {};

            let query = await firestore()
                .collection('tenant_special_dates')
                .doc(tenantid)
                .collection('special_dates')
                .get();

            query.forEach(doc => {
                let _date = doc.data();
                _specialDates[moment(_date.date.toDate()).format('YYYYMMDD')] = _date;
            });

            setSpecialDates(_specialDates);

        }

        getSpecialDates();

    }, [])

    const submit = () => {
        
        setLoading(true);

        let _timings = timings.map(elem => {
            let { out, location } = elem;
            return { in: elem.in, out, location };
        });

        console.log(date);
        console.log(_timings);

        dispatch(addAttendance({ date, timings: _timings }, tenant, user_store))
            .then(() => {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
                setTimings([
                    { in: '05:30:00', out: '12:00:00', location: '', tags: ['Morning'] },
                    { in: '16:00:00', out: '17:30:00', location: '', tags: ['Afternoon'] }
                ]);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setFailure(true);
                setTimeout(() => {
                    setFailure(false);
                }, 5000);
            });

    }

    const addTimeInSet = () => {
        let _timings = [ ...timings, { in: '12:00:00', out: '14:00:00', location: '', tags: ['Afternoon'] }];
        setTimings(identifyTags(_timings));
    }

    const removeTimeInSet = (index) => {
        let _timings = [...timings];
        _timings = _timings.filter((_item, _Index) => _Index !== index);
        setTimings(identifyTags(_timings));
    }

    const changeAttendDetails = (value, index, type) => {
        console.log(index);
        let _timings = [...timings];
        _timings[index][type] = value;
        setTimings(identifyTags(_timings));
    }

    const sortTiming = (timings) => {
        return timings.sort(function (a, b) {
            if (moment(a.in, 'HH:mm:ss').isBefore(moment(b.in, 'HH:mm:ss'))) return -1;
            if (moment(a.in, 'HH:mm:ss').isAfter(moment(b.in, 'HH:mm:ss'))) return 1;
            return 0;
        });
    }

    const identifyTags = (timings) => {
        let _hoursTotal = 0;
        timings = sortTiming(timings);
        return timings.map((timing) => {

            if (moment(timing.in, 'HH:mm:ss').isBefore(moment('12:00:00', 'HH:mm:ss'))) {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Afternoon');
                if (!timing.tags.includes('Morning')) timing.tags = [...timing.tags, 'Morning'];
            }
            else {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Morning');
                if (!timing.tags.includes('Afternoon')) timing.tags = [...timing.tags, 'Afternoon'];
            }

            if (_hoursTotal <= requiredHours) {
                timing.tags = timing.tags.filter((_item, _index) => _item !== 'Overtime');
                _hoursTotal += (moment(timing.out, 'HH:mm:ss').diff(moment(timing.in, 'HH:mm:ss'), 'hours', true));
            }
            if (_hoursTotal > requiredHours) {
                if (!timing.tags.includes('Overtime')) timing.tags = [...timing.tags, 'Overtime'];
            }

            return timing;
        });
    }

    // computed
    const hoursTotal = () => {
        return timings.reduce((accumulator, current) => {
            return accumulator + (moment(current.out, 'HH:mm:ss').diff(moment(current.in, 'HH:mm:ss'), 'hours', true));
        }, 0);
    }
    
    const adjustedHours = () => { // This includes weekends and holidays
        if (tenant.daysoff.some(_day => parseInt(_day.num) === moment(date).day())) return 0;
        else if (specialDates[moment(date).format('YYYYMMDD')]) {
            let { type, hours } = specialDates[moment(date).format('YYYYMMDD')];
            if (type === 'holiday') return 0;
            if (type === 'specialtiming') return hours;
        }
        return requiredHours;
    }

    return (
        <Block flex>
            <NavBar
                title="Time In For The Day"
                // transparent
                titleStyle={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff'
                }}
                left={
                    <Icon name="chevron-left" family="ionicons" color="#fff" size={30} onPress={() => navigation.goBack()} />
                }
                leftStyle={{
                    fontSize: 16,
                    fontWeight: 'bold'
                }}
                // onLeftPress={() => { navigation.goBack(); }}
                style={{
                    backgroundColor: '#7a7a7a'
                }}
            />

            <Toast isShow={isSuccess} positionIndicator="top" color="rgba(48, 48, 48, 0.87)" fadeInDuration={1000} fadeOutDuration={1000} style={styles.toast}
            children={
                <Text style={styles.toastText}>You have successfully Timed In!</Text>
            } />
            <Toast isShow={isFailure} positionIndicator="top" color="rgba(145, 76, 6, 0.87)" fadeInDuration={1000} fadeOutDuration={1000} style={styles.toast}
            children={
                <Text style={styles.toastText}>There was an error on submit!</Text>
            } />

            { loading
			? (
				<Block flex style={{ justifyContent: "center" }}>
					<ActivityIndicator size="large" color="#914c06" />
				</Block>
			)
			: (
                <Block flex style={{ margin: theme.SIZES.BASE }}>
                    <Block style={styles.header}>
                        <Text p size={18} style={{ color: theme.COLORS.BLACK }}>{dayType}</Text>
                        <Text p bold style={ [hoursTotal() >= adjustedHours() ? ( hoursTotal() > adjustedHours() ? { color: 'blue' } : { color: 'green' }) : { color: 'red' } ]}>
                            {hoursTotal() > adjustedHours() ? `Hours: ${hoursTotal()} | ` : ''}{hoursTotal() >= adjustedHours() ? ( hoursTotal() > adjustedHours() ? 'Overtime' : 'Regular' ) : 'Incomplete'}
                        </Text>
                    </Block>

                    <KeyboardAvoidingView style={{ flex: 1 }}>
                        <Block style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <DateTimeSelector
                                value={date}
                                // mode="time"
                                onChange={(date) => setDate(date)}
                                format="dddd MMM. D, YYYY"
                                width={width * 0.55}
                            />
                            <Button round size="small" color="#663b0e" onPress={addTimeInSet} style={{ width: width * 0.3 }}>Add</Button>
                        </Block>

                        <FlatList
                            data={timings}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => <AttendItemSet attend={item} index={index} remove={removeTimeInSet} updateList={changeAttendDetails} />}
                            ListFooterComponent={<Block style={{ height: 200 }}></Block>}
                            ListHeaderComponent={<Block style={{ height: 5 }}></Block>}
                        />

                        <Button round uppercase size="large" color="#663b0e" onPress={submit}>Submit</Button>
                    </KeyboardAvoidingView>

                </Block>
            )}
        </Block>
    );
}

const styles = StyleSheet.create({
    header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10
    },
    date: {
    },
    toast: {
        position: 'absolute',
        top: 65,
        left: 0
    },
    toastText: {
        color: '#fff'
    }
});