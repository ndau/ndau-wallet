import React, { useRef, useState, useEffect } from "react";
import { FlatList, Image, SectionList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import CustomText from "../components/CustomText";
import ScreenContainer from "../components/Screen";
import { ScreenNames } from "./ScreenNames";
import { themeColors } from "../config/colors";
import { images } from "../assets/images";
import Spacer from "../components/Spacer";
import NotificationCard from "./components/notifcations/NotificationCard";
import { NotificationDelete, NotificationFailed, NotificationSuccess } from "../assets/svgs/components";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, clearNotification, markAsRead, updateNotifications } from "../redux/actions";
import CustomModal from "../components/Modal";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotifications, saveNotifications } from "../stores/NotificationStore";


const Notifications = () => {

	const navigation = useNavigation();
	const modelNotifyDeleteRef = useRef(null)
	const [notificationId, setNotificationId] = useState(null)
	const notifications = useSelector(state => state.NotificationReducer.notifications);
	const dispatch = useDispatch();

	useEffect(() => {
		async function loadNotifications() {
			const storedNotifications = await getNotifications();
			if (storedNotifications.length > 0) {
				dispatch(updateNotifications(storedNotifications));
			}

		}

		// Initialize dispatch
		loadNotifications();
	}, []);


	const handleClearNotification = () => {
		dispatch(clearNotification(notificationId));
		const updatedNotifications = notifications.filter(
			(item) => item.id !== notificationId
		);

		// Save the updated notifications to AsyncStorage
		saveNotifications(updatedNotifications);
		modelNotifyDeleteRef.current(false)

	};

	return (
		<ScreenContainer tabScreen>
			<View style={styles.textContainer}>
				<CustomText h6 semiBold style={styles.text1}>Notifications</CustomText>
			</View>

			<Spacer height={20} />

			<FlatList
				data={notifications}
				renderItem={({ item, index }) =>
					<NotificationCard
						item={item}
						index={index}
						// onDelete={() => handleClearNotification(item?.id)}
						onDelete={() => {
							setNotificationId(item?.id)
							modelNotifyDeleteRef.current(true)
						}}

					/>}
				keyExtractor={(item, index) => index.toString()}

			/>

			<CustomModal bridge={modelNotifyDeleteRef}>
				<View style={styles.modelContainer}>

					<NotificationDelete height={40} width={40} />
					<Spacer height={25} />
					<CustomText body semiBold style={styles.alertMessage}>Are you sure want to delete</CustomText>
					<Spacer height={25} />
					<View style={styles.btnsRow}>
						<Button
							label={'Cancel'}
							onPress={() => modelNotifyDeleteRef.current(false)}
							buttonContainerStyle={styles.btnCancel}
						/>
						<Spacer width={6} />
						<Button
							label={'Delete'}
							onPress={() => {
								handleClearNotification()

							}}
							buttonContainerStyle={styles.btnDelete}
						/>
					</View>
				</View>

			</CustomModal>

		</ScreenContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	textContainer: {
		paddingVertical: 10,
		marginBottom: 20
	},
	text1: {
		width: 200,
		marginBottom: 10
	},
	imageContainer: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		borderWidth: 1,
		width: "100%",
		borderRadius: 20,
		borderColor: themeColors.fontLight,
		backgroundColor: themeColors.lightBackground,
		marginBottom: 20
	},
	modelContainer: {
		justifyContent: 'center',
		alignItems: 'center',


	},
	btnsRow: {
		flexDirection: 'row',
	},
	alertMessage: {
		textAlign: 'center'
	},
	btnCancel: {
		padding: 0,
		flex: 1,
		height: 44,
		backgroundColor: 'transparent',
		borderColor: "white",
		borderWidth: 1
	},
	btnDelete: {
		padding: 0,
		flex: 1,
		height: 44,
		backgroundColor: 'red',
	}
})

export default Notifications;