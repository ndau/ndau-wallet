import { useDispatch, useSelector } from "react-redux"
import { addWalletDetail } from "../actions";

export default useWallet = () => {
  const { wallets } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();

  const addWallet = ({
    name = "Main Wallet",
    privateKey,
    publicKey
  }) => {
    dispatch(addWalletDetail({ name, privateKey, publicKey }))
  }

  return {
    wallets,
    isWalletSetup: !!wallets.length,
    
    addWallet
  }
}