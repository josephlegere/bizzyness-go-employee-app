import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

import { userSignOut } from '../store/actions/user';

export default function Personalize({ navigation }) {

	const dispatch = useDispatch();
    const { tenant } = useSelector(state => state.tenantData);
    const { user: user_store } = useSelector(state => state.userData);

	const logout_user = () => {

		dispatch(userSignOut())
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            })
            .catch(err => {
                console.log(err);
            });
	}

    return (
        <Block flex>
            <NavBar
                // title="Bizzyness"
                // transparent
                left={(
                    <Text bold h6 color='black' >Personalize</Text>
                )}
                style={{
                    marginBottom: theme.SIZES.BASE
                }} />
            
            <Block
				style={styles.card}
            >
                <Block style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text size={18} bold style={{ color: theme.COLORS.BLACK }}>{ tenant.account }</Text>
				</Block>
            </Block>

            <View style={styles.horizontalLine}></View>
            
            <Block
				flex
				style={styles.card}
            >
                <Block style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text size={18} style={{ color: theme.COLORS.BLACK }}>{ user_store.name }</Text>
                    <Text size={18} style={{ color: theme.COLORS.BLACK }}>{ user_store.employee_code }</Text>
				</Block>
                <Block style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text size={18} style={{ color: theme.COLORS.BLACK }}>{ user_store.email }</Text>
				</Block>
            </Block>

            <View style={styles.horizontalLine}></View>

            <Button
                round
                // color="error"
                onPress={logout_user}
                size="large"
                style={{ alignSelf: 'center', backgroundColor: '#914c06' }}
            >
                Log Out
            </Button>
        </Block>
    );
}

const styles = StyleSheet.create({
	card: {
        backgroundColor: '#ebebeb',
		marginHorizontal: theme.SIZES.BASE,
		padding: theme.SIZES.BASE,
		borderRadius: theme.SIZES.BASE * 0.5,
        maxHeight: 200
	},
    horizontalLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
		marginHorizontal: theme.SIZES.BASE,
        marginVertical: 15
    }
});