import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Login({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text>Login!</Text>
            <Button
                onPress={() => navigation.navigate('Home')}
                title="Home"
            />
        </View>
    );
}