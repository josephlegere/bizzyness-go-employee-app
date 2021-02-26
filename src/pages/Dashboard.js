import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import moment from 'moment';

import theme from '../assets/theme';
import Activities from './Activities';
import Personalize from './Personalize';

const Tab = createBottomTabNavigator();

export default function Dashboard() {

	// console.log(attendance);

    return (
		<Tab.Navigator>
			<Tab.Screen name="Activities" component={Activities} />
			<Tab.Screen name="Personalize" component={Personalize} />
		</Tab.Navigator>
    );
}