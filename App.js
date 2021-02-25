/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';

const App: () => React$Node = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false
					}}
				>
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen
						name="Home"
						component={Dashboard}
						options={{ title: 'Welcome' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};

const styles = StyleSheet.create({
});

export default App;
