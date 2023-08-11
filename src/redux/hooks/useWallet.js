import { useDispatch, useSelector } from "react-redux"
import { addWalletDetail } from "../actions";
import MultiSafeHelper from "../../helpers/MultiSafeHelper";

export default useWallet = () => {
  const { wallets } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();

  const addWallet = ({
    name = "Main Wallet",
    privateKey,
    publicKey
  }) => {

    MultiSafeHelper.getDefaultUser("123456").then((user)=>{
      console.log(JSON.stringify(user))
    })


  }




  return {
    wallets,
    isWalletSetup: !!wallets.length,
    
    addWallet
  }
}