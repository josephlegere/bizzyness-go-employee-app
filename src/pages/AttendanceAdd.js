import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import DateTimeSelector from '../components/datetimeselector';
import { Block, Button, Card, Icon, Input, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

const { height, width } = Dimensions.get('window');

export default function AttendanceAdd({ navigation }) {
    
    const [ dayType, setDayType ] = useState('Work Day');
    const [ status, setStatus ] = useState('Regular');
    const [ statusColor, setStatusColor ] = useState('green');
    const [ date, setDate ] = useState(moment().toDate());

    const submit = () => {
        console.log(date);
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
                <DateTimeSelector
                    value={date}
                    // mode="time"
                    onChange={(date) => setDate(date)}
                    format="dddd MMM. D, YYYY"
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