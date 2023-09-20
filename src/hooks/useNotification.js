import { useDispatch, useSelector } from "react-redux";
import { addNotification, clearNotification, } from "../redux/actions";
import { getNotifications, saveNotifications } from "../stores/NotificationStore";
import useWallet from "./useWallet";
import { RoundEtheriumIcon, RoundNdauIcon, RoundNpayIcon, RoundUsdcIcon } from "../assets/svgs/components";
import isDate from "date-fns/fp/isDate";
import { tokenShortName } from "../utils";


export default useNotification = () => {

    const dispatch = useDispatch()
    const { getActiveWalletId } = useWallet()
    const notifications = useSelector(state => state.NotificationReducer.notifications);

    const savedNotifications = async (message, isResponse, type, fromAddress, toAddress) => {
        if (type === tokenShortName.ETHERERUM) {
            let erc_notify = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }
            dispatch(addNotification(erc_notify));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, erc_notify]);
        } else if (type === tokenShortName.NDAU) {
            let notifyObject = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }
            dispatch(addNotification(notifyObject));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, notifyObject]);

        } else if (type === tokenShortName.USDC) {
            let usdc_notify = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }
            dispatch(addNotification(usdc_notify));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, usdc_notify]);

        } else if (type === tokenShortName.NPAY) {
            let nPay_notify = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }
            dispatch(addNotification(nPay_notify));
            const currentNotifications = await getNotifications()
            saveNotifications([...currentNotifications, nPay_notify]);
        }
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