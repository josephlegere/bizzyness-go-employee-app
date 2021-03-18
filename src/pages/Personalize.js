import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Block, Button, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

import { userSignOut } from '../store/actions/user';

export default function Personalize({ navigation }) {

	const dispatch = useDispatch();

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
        <Block flex center>
            <NavBar
                // title="Bizzyness"
                // transparent
                left={(
                    <Text bold h6 color='black' >Personalize</Text>
                )} />
            <Button
                round
                // color="error"
                onPress={logout_user}
                style={{ alignSelf: 'center' }}
            >
                Log Out
            </Button>
        </Block>
    );
}