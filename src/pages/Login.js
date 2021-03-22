import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import auth from '@react-native-firebase/auth';

import { Block, Button, Icon, Input, NavBar, Text } from 'galio-framework';

import theme from '../assets/theme';

import { tenantSignOut } from '../store/actions/tenant';
import { signEmailAndPassword, signEmployeeidAndPassword } from '../store/actions/user';
import { USER_TASK_FINISHED } from '../store/types';

const { height, width } = Dimensions.get('window');

export default function Login({ navigation }) {
	const [ signOptions, setSignOptions ] = useState('emailandpassword');
	const [ credentials, setCredentials ] = useState({});
	const [ configVisible, setConfigVisible] = useState(false);
	const dispatch = useDispatch();
    const { tenant, loading: loading_tenant, errors: errors_tenant } = useSelector(state => state.tenantData);
    const { user: user_store, loading: loading_user, errors: errors_user } = useSelector(state => state.userData);

	useEffect(() => {
		console.log(loading_tenant);
		console.log(loading_user);
		
		if (tenant) setSignOptions('employeeid');
		
		auth().onAuthStateChanged((user) => {
			console.log(user);
			console.log(tenant);
			console.log(user_store);

			dispatch({
				type: USER_TASK_FINISHED
			});

			if (user_store) {

				if (user) {
					navigation.reset({
						index: 0,
						routes: [{ name: 'Home' }],
					});
				}
			}
		});
	}, []);

	const submit_user = () => { //Authenticate User

		let tenantid = tenant ? tenant.tenantid : null ;

		console.log(credentials, tenantid);

		if (signOptions === 'employeeid') {
			dispatch(signEmployeeidAndPassword(credentials, tenantid))
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				});
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setCredentials({});
			});
		}
		else {
			dispatch(signEmailAndPassword(credentials, tenantid))
			.then(() => {
				navigation.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				});
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setCredentials({});
			});
		}
		// Can't add navigation here as credentials need to be authenticated first, and verify if user has access to the tenant
		// navigation.navigate('Home');

	}

	const logout_tenant = (configVisible) => {

		setConfigVisible(configVisible);
		setSignOptions('emailandpassword');
		setCredentials({});
		dispatch(tenantSignOut());

	}

	const input_credentials = (type, value) => {
		
		let _credentials = credentials;
		_credentials[type] = value;
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
						{ tenant
						? (
							<Text h6 bold color="#000" center style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}>
								{tenant.account}
							</Text>
						)
						: (
							<Text h6 bold color="#914c06" center style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}>
								Bizzyness Go - Employee App
							</Text>
						)}
					</Block>

					<Block flex={2} center space="evenly">

						<Block flex={2}>
							{ signOptions === 'emailandpassword'
							? (
								<Block>
									
									<Text>Email</Text>
									<Input
										rounded
										type="email-address"
										placeholder="Email"
										autoCapitalize="none"
										style={{ width: width * 0.9 }}
										onChangeText={text => input_credentials('email', text)}
									/>
									
									<Text>Password</Text>
									<Input
										rounded
										password
										viewPass
										placeholder="Password"
										style={{ width: width * 0.9 }}
										onChangeText={text => input_credentials('password', text)}
									/>
								</Block>
							)
							: (
								<Block>

									<Text>Employee ID</Text>
									<Input
										rounded
										type="number-pad"
										placeholder="Employee ID"
										style={{ width: width * 0.9 }}
										onChangeText={text => input_credentials('employeeid', text)}
									/>
									
									<Text>Password</Text>
									<Input
										rounded
										password
										viewPass
										placeholder="Password"
										style={{ width: width * 0.9 }}
										onChangeText={text => input_credentials('password', text)}
									/>
								</Block>
							)}
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
							{ signOptions === 'emailandpassword'
								? (
									<Block flex>
										<Text color="#914c06" onPress={() => {
											setSignOptions('employeeid');
											setCredentials({});
										}}>Sign-In with Employee ID</Text>
									</Block>
								)
								: (
									<Block flex>
										<Text color="#914c06" onPress={() => {
											setSignOptions('emailandpassword');
											setCredentials({});
										}}>Sign-In with Email</Text>
									</Block>
							)}
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