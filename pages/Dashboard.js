import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet } from 'react-native';

import { Block, Card, Icon, NavBar, Text } from 'galio-framework';
import moment from 'moment';

import theme from '../assets/theme';

const { height, width } = Dimensions.get('window');

export default function Dashboard() {

    const [ attendance, setAttendance ] = useState([]);

	useEffect(() => {

		function getAttendance () {
			setAttendance([
				{
					date: '2021-02-27',
					timings: {
						day_min: [
							'04:30am - 09:30am',
							'10:30am - 12:00pm'
						],
						noon_min: [
							'02:00pm - 03:30pm',
							'04:00pm - 05:30pm',
							'06:30pm - 08:00pm',
							'09:00pm - 11:00pm'
						]
					},
					ottimings: [
						'04:00pm - 05:30pm',
						'06:30pm - 08:00pm',
						'09:00pm - 11:00pm',
						'09:00pm - 11:00pm'
					],
					othours: '5',
					locations: '',
					status: 'REG'
				},
				{
					date: '2021-03-01',
					timings: {
						day_min: [
							'5:30am - 12:00pm'
						],
						noon_min: [
							'4:00pm - 5:30pm'
						]
					},
					ottimings: [],
					othours: '',
					locations: '',
					status: 'REG'
				},
				{
					date: '2021-03-02',
					timings: {
						day_min: [
							'5:30am - 12:00pm'
						],
						noon_min: [
							'4:00pm - 5:30pm'
						]
					},
					ottimings: [],
					othours: '',
					locations: '',
					status: 'REG'
				}
			]);
		}
		
		getAttendance();

	}, []);

	// console.log(attendance);

    return (
        <Block safe flex>
			<NavBar title="Attendance" transparent />
            <ScrollView style={{ marginBottom: 20 }}>
				{/* <Block flex space="between" style={styles.section}> */}
					{attendance && attendance.map((attend, id) => (
						<Block
							key={id}
							flex
							borderless
                			style={styles.card}
							// shadowColor={theme.COLORS.BLACK}
							// titleColor={card.full ? theme.COLORS.WHITE : null}
							// title={card.title}
							// caption={card.caption}
							// location={card.location}
							// avatar={`${card.avatar}?${id}`}
						>
							<Block style={styles.cardHeader}>
								<Text h6 style={{ color: theme.COLORS.WHITE }}>{moment(attend.date).format('ddd MMM DD, YYYY')}</Text>
								<Text p style={{ color: theme.COLORS.WHITE }}>{attend.status}</Text>
							</Block>
							<Block style={{ marginBottom: 10 }}>
								<Block style={styles.row}>
									<Block style={styles.col}>
										<Text size={20} bold style={{ color: theme.COLORS.WHITE }}>Day</Text>
										{attend.timings.day_min && attend.timings.day_min.map((day, day_id) => (
											<Text size={18} key={day_id} style={{ color: theme.COLORS.WHITE }}>{day}</Text>
										))}
									</Block>
									<Block style={styles.col}>
										<Text size={20} bold style={{ color: theme.COLORS.WHITE }}>Noon</Text>
										{attend.timings.noon_min && attend.timings.noon_min.map((noon, noon_id) => (
											<Text size={18} key={noon_id} style={{ color: theme.COLORS.WHITE }}>{noon}</Text>
										))}
									</Block>
								</Block>
							</Block>
							
							<Text size={20} bold style={{ color: theme.COLORS.WHITE }}>Overtime - {attend.othours} Hours</Text>
							<Block style={{ borderWidth: 1, borderColor: 'red', height: 80, flexWrap: 'wrap', flexDirection: 'column', alignContent: 'space-between', marginBottom: 10 }}>
								{attend.ottimings && attend.ottimings.map((ot, ot_id) => (
									<Text size={18} key={ot_id} style={{ color: theme.COLORS.WHITE }}>{ot}</Text>
								))}
							</Block>

							<Text size={20} bold style={{ color: theme.COLORS.WHITE }}>Location: </Text>
							<Text style={{ color: theme.COLORS.WHITE }}>Location: </Text>
						</Block>
					))}
            </ScrollView>
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
		marginBottom: 10
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	col: {
		flexDirection: 'column'
	}
});