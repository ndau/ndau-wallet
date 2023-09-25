import { useDispatch, useSelector } from "react-redux";
import { addNotification, clearNotification, } from "../redux/actions";
import { getNotifications, saveNotifications } from "../stores/NotificationStore";
import { tokenShortName } from "../utils";
import useWallet from "./useWallet";

export default useNotification = () => {

    const dispatch = useDispatch()
    const { getActiveWalletId } = useWallet()
    const notifications = useSelector(state => state.NotificationReducer.notifications)

    const savedNotifications = async (message, isResponse, type, fromAddress, toAddress) => {
        let obj = notificationsObject(message, isResponse, type, fromAddress, toAddress)
        if (type === tokenShortName.ETHERERUM) {
            dispatch(addNotification(obj));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        } else if (type === tokenShortName.NDAU) {
            dispatch(addNotification(obj));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        } else if (type === tokenShortName.USDC) {
            dispatch(addNotification(obj))
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        } else if (type === tokenShortName.NPAY) {
            dispatch(addNotification(obj));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        } else if (type === tokenShortName.MATIC) {
            dispatch(addNotification(obj));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        
        } else if (type === tokenShortName.ZK_ETH) {
            dispatch(addNotification(obj));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, obj]);
        }
    }

    const notificationsObject = (message, isResponse, type, fromAddress, toAddress) => {
        let object = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }
        return object
    }

    const deleteNotifications = (id) => {
        dispatch(clearNotification(id));
        const updatedNotifications = notifications.filter(
            (item) => item.id !== id
        );
        saveNotifications(updatedNotifications);
    }

    const filterWalletNotifications = (data) => {
        const filterNotify = data?.filter(
            item => item.walletId === getActiveWalletId()
        );
        return filterNotify
    }

    return {
        savedNotifications,
        deleteNotifications,
        filterWalletNotifications
    }
}