import { useEffect, useState } from "react";
import { NetworkManager } from "../helpers/EthersScanAPI";
import { ethers } from "ethers";
import UserStore from "../stores/UserStore";


export default useConvert = () => {

    const wallet = new ethers.Wallet(UserStore.getActiveWallet().ercKeys.privateKey);
    const provider = ethers.getDefaultProvider(NetworkManager.getEnv().zkSyncEra);
    const [networkChainId, setNetworkChainId] = useState(null);

    const convertSchema = [
        { name: 'amount', type: 'uint256' },
        { name: 'npay_adddress', type: 'address' },
        { name: 'ndau_address', type: 'address' },
        { name: 'nonce', type: 'uint256' },
    ];

    useEffect(() => {
        async function loadChainId() {
            try {
                const network = await provider.getNetwork();
                setNetworkChainId(networkChainId?.chainId)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        loadChainId();
        return () => { }
    }, []);

    const getTypedMessage = (convertData) => {
        const typedData = JSON.stringify(
            {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' },
                    ],
                    converTransaction: convertSchema,
                },
                primaryType: 'convert',
                domain: {
                    name: 'ndau-wallet',
                    version: '1.0',
                    chainId: networkChainId,
                    // verifyingContract: NetworkManager.__contractAddresses
                },
                message: convertData,
            }
        )
        return typedData;
    }

    const sigedLegacyWallet = (data) => {
        return new Promise(async (resolve, reject) => {
            // try {
            //     // Sign the message
            //     const signature = await wallet.signMessage(data);
            //     // const recoveredAddress = ethers.utils.verifyMessage(data, signature);
            //     resolve(signature)
            // } catch (error) {

            // }
        })
    }

    const sigedErcWallet = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const getData = getTypedMessage(data)
                const signature = await wallet.signMessage(getData);     // Sign the message
                const recoveredAddress = ethers.utils.verifyMessage(getData, signature); // recovered the message

                let result = {
                    signedData: signature,
                    recoveredAddress: recoveredAddress
                }
                resolve(result)

            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        sigedErcWallet,
        sigedLegacyWallet,
    }

}