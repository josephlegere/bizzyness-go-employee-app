/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import AttendanceAdd from './src/pages/AttendanceAdd';
import store from './src/store';

const App: () => React$Node = () => {
	
	// console.log(store.getState());

	return (
		<Provider store={store}>
			<>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false
						}}
					>
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Home" component={Dashboard} />
						<Stack.Screen name="Add Attendance" component={AttendanceAdd} />
					</Stack.Navigator>
				</NavigationContainer>
			</>
		</Provider>
	);
};

export default App;
