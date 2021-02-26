import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';
import Activities from './Activities';
import Personalize from './Personalize';

const Tab = createBottomTabNavigator();

export default function Dashboard() {

	// console.log(attendance);

    return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Activities') {
						iconName = 'home-filled';
						// iconName = focused
						// ? 'ios-information-circle'
						// : 'ios-information-circle-outline';
					} else if (route.name === 'Personalize') {
						iconName = focused ? 'person' : 'person-outline';
					}

					// You can return any component that you like here!
					return <Icon name={iconName} family="ionicons" color={color} size={size} />;
				}
			})}
			tabBarOptions={{
				activeTintColor: '#914c06',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen name="Activities" component={Activities} />
			<Tab.Screen name="Personalize" component={Personalize} />
		</Tab.Navigator>
    );
}