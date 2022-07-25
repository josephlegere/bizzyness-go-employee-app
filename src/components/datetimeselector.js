import React, {useState} from 'react';
import { Pressable, StyleSheet } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Block, Button, Icon, Input, Text } from 'galio-framework';
import moment from 'moment';

export default function DateTimeSelector(props, { navigation }) {

    let { value, mode, format, onChange, width, minimumDate, maximumDate } = props;

    const convertToProper = () => {
        let _datetime;

        if (mode === 'time' && !isValidDate(value)) {
            if (value) {_datetime = moment(`${moment().format('YYYY-MM-DD')} ${value}`).toDate();}
            else {_datetime = moment().toDate();}
        }
        else {
            if (value) {_datetime = moment(value).toDate();}
            else {_datetime = moment().toDate();}
        }

        return _datetime;
    }

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    // const [ date, setDate ] = useState(convertToProper());
    const [ show, setShow ] = useState(false);

    const setDate = (event, selectedDate) => {
        const currentDate = selectedDate || convertToProper();
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };

    const showDialog = () => {
        setShow(true);
    }
    
    // const dateToString = () => {
    //     return moment(date).format('dddd MMM. D, YYYY');
    // };

    const modeToDisplay = () => {
        let _format = 'YYYY-MM-DD'

        if (format)
            _format = format;
        else if (mode === 'time')
            _format = 'hh:mm A';

        return moment(convertToProper()).format(_format);
    }

    return (
        <Block>
            <Pressable onPress={showDialog}>
                <Input borderless rounded value={modeToDisplay()} editable={false} style={[ width ? { width } : {} ]} />
            </Pressable>

            {show && (
                <DateTimePicker
                    value={convertToProper()}
                    mode={mode || 'date'}
                    is24Hour={true}
                    display="default"
                    onChange={setDate}
                    minimumDate={minimumDate || null}
                    maximumDate={maximumDate || null}
                />
            )}
        </Block>
    );
}

const styles = StyleSheet.create({
    header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10
    }
});