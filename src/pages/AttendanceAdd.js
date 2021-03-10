import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, Pressable, RefreshControl, StyleSheet } from 'react-native';

import { Block, Button, Card, Icon, Input, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import DateTimeSelector from '../components/DateTimeSelector';
import AttendItemSet from '../components/AttendItemSet';
import theme from '../assets/theme';

const { height, width } = Dimensions.get('window');

export default function AttendanceAdd({ navigation }) {
    
    const [ dayType, setDayType ] = useState('Work Day');
    const [ date, setDate ] = useState(moment().toDate());
    const [ timings, setTimings ] = useState([
        { in: '05:30:00', out: '12:00:00', location: '', tags: ['Morning'] },
        { in: '16:00:00', out: '17:30:00', location: '', tags: ['Afternoon'] }
    ]);
    // tags are important information of the attend / timing object, e.g. Morning, Afternoon, Overtime, indicating that if the object is morning or has reach overtime

    const requiredHours = 8;

    const submit = () => {
        console.log(date);
        console.log(timings);
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
                }} />

            <Block flex style={{ margin: theme.SIZES.BASE }}>
                <Block style={styles.header}>
                    <Text p size={18} style={{ color: theme.COLORS.BLACK }}>{dayType}</Text>
                    <Text p bold style={ [hoursTotal() >= requiredHours ? ( hoursTotal() > requiredHours ? { color: 'blue' } : { color: 'green' }) : { color: 'red' } ]}>
                        {hoursTotal() > requiredHours ? `Hours: ${hoursTotal()} | ` : ''}{hoursTotal() >= requiredHours ? ( hoursTotal() > requiredHours ? 'Overtime' : 'Regular' ) : 'Incomplete'}
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
    }
});