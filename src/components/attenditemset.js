import React, {useState} from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';

import { Block, Button, Icon, Input, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

import DateTimeSelector from './datetimeselector';

const { height, width } = Dimensions.get('window');

export default function AttendItemSet(props) {

    let { attend } = props;
    
    const deleteItem = () => {
        console.log('Clear');
    }

    return (
        <Block style={styles.card}>
            <Block style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <DateTimeSelector mode="time" width={ width * 0.38 } />
                <DateTimeSelector mode="time" width={ width * 0.38 } />
            </Block>
            <Input borderless rounded placeholder="Location" placeholderTextColor="#cfcfcf" />
            <Button onlyIcon icon="clear" iconFamily="ionicons" iconSize={12} color="#bd2e24" iconColor="#fff" onPress={deleteItem} style={styles.clear} ></Button>
        </Block>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#c4c4c4',
		// marginVertical: theme.SIZES.BASE * 0.875,
		elevation: theme.SIZES.BASE / 2,
        marginVertical: 8,
		marginHorizontal: 10,
		padding: theme.SIZES.BASE,
		borderRadius: theme.SIZES.BASE * 1.25
	},
    clear: {
        position: 'absolute',
        top: -15,
        right: -15,
        zIndex: 50
    }
});