import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Block, Button, Card, Icon, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

export default function AttendanceAdd({ navigation }) {
    
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    };

    const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
    };

    const showDatepicker = () => {
    showMode('date');
    };

    const showTimepicker = () => {
    showMode('time');
    };

    return (
        <Block flex center>
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
            <Block flex style={{ justifyContent: 'center' }}>
                <Block>
                    <Button onPress={showDatepicker}>
                        Show date picker!
                    </Button>
                </Block>
                <Block>
                    <Button onPress={showTimepicker}>
                        Show time picker!
                    </Button>
                </Block>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </Block>
        </Block>
    );
}