import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Card, Icon, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

import { getAttendance } from '../store/actions/attendance';

const { height, width } = Dimensions.get('window');

export default function Activities({ navigation }) {
	const [refreshing, setRefreshing] = React.useState(false);
	const dispatch = useDispatch();
    const { attendance, loading, errors } = useSelector(state => state.attendanceList);

	useEffect(() => {

		dispatch(getAttendance());

	}, [dispatch]);

	const reloadActivity = () => {
		setRefreshing(true);
		dispatch(getAttendance()).then(() => {
			setRefreshing(false);
		});
	}

	// console.log(attendance);
	
	const Activity = (props) => {
		
		let { attend } = props;

		return (
			<Block
				flex
				borderless
				style={styles.card}
			>
				<Block style={styles.cardHeader}>
					<Text h6 style={{ color: theme.COLORS.WHITE }}>{moment(attend.date).format('ddd MMM DD, YYYY')}</Text>
					<Text p style={{ color: theme.COLORS.WHITE }}>{attend.workstatus}</Text>
				</Block>
				<Block style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-start' }}>
					<Text size={18} style={{ color: theme.COLORS.WHITE }}>{attend.daytype}</Text>
				</Block>
				<Block style={{ marginBottom: 10 }}>
					<Block style={styles.row}>
						<Block style={styles.col}>
							<Text size={20} bold style={{ color: theme.COLORS.WHITE, marginBottom: 5 }}>Day</Text>
							{attend.timings.day_min && attend.timings.day_min.map((day, day_id) => (
								<Text size={18} key={day_id} style={{ color: theme.COLORS.WHITE }}>{day}</Text>
							))}
						</Block>
						<Block style={styles.col}>
							<Text size={20} bold style={{ color: theme.COLORS.WHITE, marginBottom: 5 }}>Noon</Text>
							{attend.timings.noon_min && attend.timings.noon_min.map((noon, noon_id) => (
								<Text size={18} key={noon_id} style={{ color: theme.COLORS.WHITE }}>{noon}</Text>
							))}
						</Block>
					</Block>
				</Block>
				
				{attend.ottimings.length > 0 ?
				<Block style={{ marginBottom: 10 }}>
					<Text style={{ color: theme.COLORS.WHITE, marginBottom: 5 }}>
						<Text size={20} bold>Overtime&nbsp;</Text>
						<Text size={16}> - {attend.othours} Hours</Text>
					</Text>
					<Block style={{ maxHeight: 80, flexWrap: 'wrap', flexDirection: 'column', alignContent: 'space-between', marginBottom: 10 }}>
						{attend.ottimings && attend.ottimings.map((ot, ot_id) => (
							<Text size={18} key={ot_id} style={{ color: theme.COLORS.WHITE }}>{ot}</Text>
						))}
					</Block>
				</Block> : <Block></Block>}

				{attend.locations !== '' ?
				<Text style={{ color: theme.COLORS.WHITE, marginBottom: 10 }}>
					<Icon name="location-pin" family="entypo" color="#fff" size={20} />
					{/* <Text size={20} bold>Location: </Text> */}
					<Text size={16}>{attend.locations}</Text>
				</Text> : <Block></Block>}
				<Block style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
					<Text size={15} style={{ color: theme.COLORS.WHITE, marginRight: 15 }}>{attend.verify}</Text>
                    <Icon name="dots-three-vertical" family="entypo" color="#fff" size={18} onPress={() => console.log('Activity Settings')} />
				</Block>
			</Block>
		)
	}

	// const timein = () => {
	// 	console.log('Time In!');
	// }

    return (
        <Block safe flex>
			<NavBar
                // title="Bizzyness"
                transparent
                left={(
                    <Text bold size={22} color='black' >Bizzyness</Text>
                )}
                style={{ height: 50 }} />

			{ loading
			? (
				<Block flex style={{ justifyContent: "center" }}>
					<ActivityIndicator size="large" color="#914c06" />
				</Block>
			)
			: (
					<FlatList
						data={attendance}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item}) => <Activity attend={item} />}
						style={{ marginBottom: 40 }}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={() => reloadActivity()}
							/>
						}
						ListFooterComponent={<Block style={{ height: 20 }}></Block>}
					/>
			)}
			<Block style={styles.fabContainer}>
				<Button onlyIcon icon="timer" iconFamily="ionicons" iconSize={40} color="#914c06" iconColor="#fff" style={styles.fab} onPress={() => navigation.navigate('Add Attendance')}></Button>
				<Button onlyIcon disabled icon="add" iconFamily="ionicons" iconSize={25} color="#fff" iconColor="#914c06" style={styles.badge}></Button>
			</Block>
        </Block>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: 'rgba(137, 137, 137, 0.2)',
		borderRadius: 7,
		margin: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		height: height * 0.93
    },
	card: {
        backgroundColor: '#303030',
		// marginVertical: theme.SIZES.BASE * 0.875,
		elevation: theme.SIZES.BASE / 2,
		marginTop: theme.SIZES.BASE,
		marginHorizontal: theme.SIZES.BASE,
		padding: theme.SIZES.BASE,
		borderRadius: theme.SIZES.BASE * 0.5
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// marginBottom: 10
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	col: {
		flexDirection: 'column'
	},
	fabContainer: {
		zIndex: 998,
		position: 'absolute',
		bottom: 0,
		right: 0
	},
	fab: {
		width: 60,
		height: 60,
	},
	badge: {
		width: 25,
		height: 25,
		zIndex: 999,
		position: 'absolute',
		top: -8,
		right: -8
	}
});