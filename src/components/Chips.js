import React, {useState} from 'react';
import { StyleSheet } from 'react-native';

import { Block, Button, Icon, Input, Text } from 'galio-framework';

import theme from '../assets/theme';

export default function DateTimeSelector(props) {

    let { value } = props;

    return (
        <Block style={styles.chip}>
            <Text size={12} style={{ color: '#fff' }}>
                {value}
            </Text>
        </Block>
    );
}

const styles = StyleSheet.create({
    chip: {
		marginHorizontal: theme.SIZES.BASE * 0.1875,
		padding: theme.SIZES.BASE * 0.625,
		borderRadius: theme.SIZES.BASE * 1.56,
        backgroundColor: '#303030'
	}
});