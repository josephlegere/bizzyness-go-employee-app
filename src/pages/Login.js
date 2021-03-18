import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import auth from '@react-native-firebase/auth';

import { Block, Button, Icon, Input, NavBar, Text } from 'galio-framework';

import theme from '../assets/theme';

import { tenantSignOut } from '../store/actions/tenant';
import { userSignIn } from '../store/actions/user';
import { USER_TASK_FINISHED } from '../store/types';

const { height, width } = Dimensions.get('window');

export default function Login({ navigation }) {
	const [ credentials, setCredentials ] = useState({});
	const [ configVisible, setConfigVisible] = useState(false);
	const dispatch = useDispatch();
    const { tenant, loading: loading_tenant, errors: errors_tenant } = useSelector(state => state.tenantData);
    const { user: user_store, loading: loading_user, errors: errors_user } = useSelector(state => state.userData);

	useEffect(() => {
		console.log(loading_tenant);
		console.log(loading_user);
		
		auth().onAuthStateChanged((user) => {
			console.log(user);
			console.log(tenant);
			console.log(user_store);

			dispatch({
                type: USER_TASK_FINISHED
            });

      		if (user) {
				navigation.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				});
			}
		});
	}, []);

	const submit_user = () => { //Authenticate User

		let tenantid = tenant ? tenant.tenantid : null ;

		console.log(credentials);
		dispatch(userSignIn(credentials, tenantid));
		// Can't add navigation here as credentials need to be authenticated first, and verify if user has access to the tenant
		// navigation.navigate('Home');

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

			{ loading_user
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
						{ tenant
						? (
							<Block flex>
								<Text onPress={() => console.log('sign-in options')}>Sign-In Options</Text>
							</Block>
						)
						: (
							<Block flex={2}>
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
            			<Button onlyIcon icon="clear" iconFamily="ionicons" iconSize={12} color="#303030" iconColor="#fff" onPress={() => setConfigVisible(!configVisible)} style={styles.modalClear} ></Button>
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
	},
    modalClear: {
        position: 'absolute',
        top: -17,
        right: -17,
        zIndex: 999
    }
});