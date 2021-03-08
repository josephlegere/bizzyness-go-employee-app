import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import { Block, Button, Card, Icon, Input, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import DateTimeSelector from '../components/DateTimeSelector';
import AttendItemSet from '../components/AttendItemSet';
import theme from '../assets/theme';

const { height, width } = Dimensions.get('window');

export default function AttendanceAdd({ navigation }) {
    
    const [ dayType, setDayType ] = useState('Work Day');
    const [ status, setStatus ] = useState('Regular');
    const [ statusColor, setStatusColor ] = useState('green');
    const [ date, setDate ] = useState(moment().toDate());
    const [ timings, setTimings ] = useState(['hi', 'hello']);

    const submit = () => {
        console.log(date);
    }

    const addTimeInObject = () => {
        setTimings([ ...timings, 'hi' ]);
    }

    return (
        <Block flex>
            <NavBar
                title="Time In"
                // transparent
                back
                titleStyle={{
                    fontSize: 16,
                    fontWeight: 'bold'
                }}
                leftStyle={{
                    fontSize: 16,
                    fontWeight: 'bold'
                }}
                onLeftPress={() => { navigation.goBack(); }} />

            <Block flex style={{ margin: theme.SIZES.BASE }}>
                <Block style={styles.header}>
                    <Text p size={18} style={{ color: theme.COLORS.BLACK }}>{dayType}</Text>
                    <Text p bold style={{ color: statusColor }}>{status}</Text>
                </Block>

                {/* <DateTimeSelector value={date} mode="time" /> */}
                <Block style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <DateTimeSelector
                        value={date}
                        // mode="time"
                        onChange={(date) => setDate(date)}
                        format="dddd MMM. D, YYYY"
                        width={width * 0.5}
                    />
                    <Button round  size="small" color="#663b0e" onPress={addTimeInObject} style={{ width: width * 0.3 }}>Add</Button>
                </Block>

                <FlatList
                    data={timings}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => <AttendItemSet attend={item} />}
                />

                <Button round uppercase size="large" color="#663b0e" onPress={submit}>Submit</Button>

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