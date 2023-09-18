import { useDispatch } from "react-redux";
import { addNotification, } from "../redux/actions";
import { getNotifications, saveNotifications } from "../stores/NotificationStore";
import useWallet from "./useWallet";
import { RoundEtheriumIcon, RoundNdauIcon, RoundNpayIcon, RoundUsdcIcon } from "../assets/svgs/components";


export default useNotification = () => {

    const dispatch = useDispatch()
    const { getActiveWalletId } = useWallet()


    const savedNotifications = async (message, isResponse, type, fromAddress, toAddress) => {

        if (type === "erc") {

            let Erc_notify = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }

            dispatch(addNotification(Erc_notify));

            const currentNotifications = await getNotifications()

            saveNotifications([...currentNotifications, Erc_notify]);
        }
        else if (type === 'ndau') {

            let notifyObject = { id: Date.now(), message: message, isBoolean: isResponse, walletId: getActiveWalletId(), transaction: { fromAddress: fromAddress, toAddress: toAddress }, type: type }

            dispatch(addNotification(notifyObject));

            const currentNotifications = await getNotifications()

            saveNotifications([...currentNotifications, notifyObject]);

        } else if (type === 'usdc') {



        } else if (type === 'npay') {


        }

    }

    return {
        savedNotifications,

    }


}