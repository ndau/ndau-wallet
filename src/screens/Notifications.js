import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { NotificationDelete } from "../assets/svgs/components";
import Button from "../components/Button";
import CustomText from "../components/CustomText";
import CustomModal from "../components/Modal";
import ScreenContainer from "../components/Screen";
import Spacer from "../components/Spacer";
import { themeColors } from "../config/colors";
import { useWallet } from "../hooks";
import useNotification from "../hooks/useNotification";
import { updateNotifications } from "../redux/actions";
import { getNotifications } from "../stores/NotificationStore";
import NotificationCard from "./components/notifcations/NotificationCard";


const Notifications = (props) => {

	const modelNotifyDeleteRef = useRef(null)
	const [notificationId, setNotificationId] = useState(null)
	const { getActiveWalletId } = useWallet()
	const { cleardNotifications } = useNotification()
	const notifications = useSelector(state => state.NotificationReducer.notifications);
	const dispatch = useDispatch();
	const isFocused = useIsFocused()

	useEffect(() => {
		async function loadNotifications() {
			const storedNotifications = await getNotifications();

			if (storedNotifications.length > 0) {
				dispatch(updateNotifications(storedNotifications));
			}
		}
		loadNotifications();
	}, [isFocused]);


	const handleClearNotification = async () => {

		// dispatch(clearNotification(notificationId));
		// const updatedNotifications = notifications.filter(
		// 	(item) => item.id !== notificationId
		// );

		// saveNotifications(updatedNotifications);

		cleardNotifications(notificationId)
		modelNotifyDeleteRef.current(false)
	};

	const filterWalletNotifications = (data) => {

		const filterNotify = data?.filter(
			item => item.walletId === getActiveWalletId()
		);

		return filterNotify
	}


	return (
		<ScreenContainer tabScreen>
			<View style={styles.textContainer}>
				<CustomText h6 semiBold style={styles.text1}>Notifications</CustomText>
			</View>

			<Spacer height={20} />

			<FlatList
				data={filterWalletNotifications(notifications)}

				renderItem={({ item, index }) =>
					<NotificationCard
						item={item}
						index={index}
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