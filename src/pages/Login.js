import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Icon, Input, NavBar, Text } from 'galio-framework';

import theme from '../assets/theme';

import { tenantSignIn, tenantSignOut } from '../store/actions/tenant';

const { height, width } = Dimensions.get('window');

export default function Login({ navigation }) {
	const [ credentials, setCredentials ] = useState({});
	const [ configVisible, setConfigVisible] = useState(false);
	const dispatch = useDispatch();
    const { tenant, loading, errors } = useSelector(state => state.tenantData);

	const submit_tenant = () => {

		console.log(credentials);
		dispatch(tenantSignIn(credentials));
		
	}

	const submit_user = () => { //Authenticate user

		console.log(credentials);
		navigation.navigate('Home');

	}

	const logout_tenant = (configVisible) => {

		setConfigVisible(configVisible);
		dispatch(tenantSignOut());

	}

	const input_credentials = (type, value) => {
		let _credentials = credentials;

		if (type === 'email') _credentials[type] = value;
		else if (type === 'password') _credentials[type] = value;
		
		setCredentials(_credentials);
	}

    return (
        <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
			<Block style={{ marginTop: 20 }} />
			<NavBar
				title="Bizzyness"
				right={(
					<Block>
						{ tenant
						? (
							<Icon name="settings" family="ionicons" color="#303030" size={15} onPress={() => setConfigVisible(true)} />
						)
						: (
							<Block />
						)}
					</Block>
				)}
				style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : { marginTop: theme.SIZES.BASE }}
			/>

			{ loading
			? (
				<Block flex style={{ justifyContent: "center" }}>
					<ActivityIndicator size="large" color="#914c06" />
				</Block>
			)
			: (
				<KeyboardAvoidingView style={styles.container} behavior="height" enabled>
					<Block flex center style={{ marginTop: theme.SIZES.BASE * 4, marginBottom: -1 * (height / 20) }}>
						<Text muted center size={theme.SIZES.FONT * 0.875} style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}>
							Will Place Business Name here, then Logo at the bottom
						</Text>
					</Block>

					<Block flex={2} center space="evenly">

						{ tenant
						? (
							<Block flex={2}>
								<Input
									rounded
									type="email-address"
									placeholder="Email"
									autoCapitalize="none"
									style={{ width: width * 0.9 }}
									onChangeText={text => input_credentials('email', text)}
								/>
								<Input
									rounded
									password
									viewPass
									placeholder="Password"
									style={{ width: width * 0.9 }}
									onChangeText={text => input_credentials('password', text)}
								/>
								<Button
									round
									color="error"
									onPress={submit_user}
									style={{ alignSelf: 'center' }}
								>
									Sign in
								</Button>
							</Block>
						)
						: (
							<Block flex={2}>
								<Input
									rounded
									type="email-address"
									placeholder="Email"
									autoCapitalize="none"
									style={{ width: width * 0.9 }}
									onChangeText={text => input_credentials('email', text)}
								/>
								<Input
									rounded
									password
									viewPass
									placeholder="Password"
									style={{ width: width * 0.9 }}
									onChangeText={text => input_credentials('password', text)}
								/>
								<Button
									round
									color="error"
									onPress={submit_tenant}
									style={{ alignSelf: 'center' }}
								>
									Bizzyness Sign in
								</Button>
							</Block>
						)}
					</Block>
				</KeyboardAvoidingView>
			)}
			
			<Modal
				animationType="fade"
				transparent={true}
				visible={configVisible}
				onRequestClose={() => {
					setConfigVisible(!configVisible);
				}}
			>
				<Block flex style={styles.centeredView}>
				<Block style={styles.modalView}>
					<Text style={{ marginBottom: 15, textAlign: "center" }}>Configurations</Text>
					<Button onPress={() => logout_tenant(!configVisible)}>Logout Business</Button>
				</Block>
				</Block>
			</Modal>
      	</Block>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.SIZES.BASE * 0.3,
        paddingHorizontal: theme.SIZES.BASE,
        backgroundColor: theme.COLORS.WHITE,
    },
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	}
});