import React, { useState, useEffect } from 'react';

import { Block, Button, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

export default function Personalize() {

	// console.log(attendance);

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
                // onPress={() => navigation.navigate('Home')}
                style={{ alignSelf: 'center' }}
            >
                Log Out
            </Button>
        </Block>
    );
}