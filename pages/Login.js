import React, { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Block, Button, Input, NavBar, Text } from 'galio-framework';

import theme from '../assets/theme';

const { height, width } = Dimensions.get('window');

export default function Login({ navigation }) {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

    return (
        <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
			<Block style={{ marginTop: 20 }} />
			<NavBar
				title="Bizzyness"
				onLeftPress={() => navigation.openDrawer()}
				style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : { marginTop: theme.SIZES.BASE }}
			/>
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
							onChangeText={text => this.handleChange('email', text)}
						/>
						<Input
							rounded
							password
							viewPass
							placeholder="Password"
							style={{ width: width * 0.9 }}
							onChangeText={text => this.handleChange('password', text)}
						/>
						<Button
							round
							color="error"
							onPress={() => navigation.navigate('Home')}
							style={{ alignSelf: 'center' }}
						>
							Sign in
						</Button>
						{/* <Text
							color={theme.COLORS.ERROR}
							size={theme.SIZES.FONT * 0.75}
							onPress={() => Alert.alert('Not implemented')}
							style={{ alignSelf: 'flex-end', lineHeight: theme.SIZES.FONT * 2 }}
						>
							Forgot your password?
						</Text> */}
					</Block>
					{/* <Block flex middle>
						<Button
							round
							color="error"
							onPress={() => Alert.alert(
								'Sign in action',
								`Email: ${email}
								Password: ${password}`
							)}
						>
							Sign in
						</Button>
						<Button color="transparent" shadowless onPress={() => navigation.navigate('Register')}>
							<Text center color={theme.COLORS.ERROR} size={theme.SIZES.FONT * 0.75}>
							{"Don't have an account? Sign Up"}
							</Text>
						</Button>
					</Block> */}
				</Block>
			</KeyboardAvoidingView>
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
    }
});