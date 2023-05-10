import React, {useState} from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Pressable, StyleSheet } from 'react-native';

import { Block, Button, Icon, Input, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

import DateTimeSelector from './datetimeselector';
import Chips from './Chips';

const { height, width } = Dimensions.get('window');

export default function AttendItemSet(props) {

    let { attend, index, remove, updateList } = props;
    // console.log(attend);
    // console.log(index);
    // console.log(remove);

    // components 
    const ChipsTimeInSet = (props) => {

        let { tags } = props;

        return (
            <FlatList
                data={tags}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <Chips value={item} />}
                horizontal
            />
        );
    }

    return (
        <Block style={styles.card}>
            <Block style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <DateTimeSelector mode="time" width={ width * 0.39 } value={attend.in} onChange={(date) => updateList(moment(date).format('HH:mm:ss'), index, 'in')} />
                <DateTimeSelector mode="time" width={ width * 0.39 } value={attend.out} onChange={(date) => updateList(moment(date).format('HH:mm:ss'), index, 'out')} />
            </Block>
            <Input borderless rounded placeholder="Location" placeholderTextColor="#cfcfcf" value={attend.location} onChangeText={text => updateList(text, index, 'location')} />
            <Button onlyIcon icon="remove" iconFamily="ionicons" iconSize={12} color="#bd2e24" iconColor="#fff" onPress={() => remove(index)} style={styles.clear} ></Button>
            
            <Block style={styles.chipset} >
                <ChipsTimeInSet tags={attend.tags} />
            </Block>
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
		padding: theme.SIZES.BASE * 0.625,
        paddingBottom: theme.SIZES.BASE * 2.75,
		borderRadius: theme.SIZES.BASE * 1.25
	},
    clear: {
        position: 'absolute',
        top: -17,
        right: -17,
        zIndex: 50
    },
    chipset: {
        position: 'absolute',
        left: 12,
        bottom: 7
    }
});