import { useEffect, useState } from "react";
import { NetworkManager } from "../helpers/EthersScanAPI";
import { ethers } from "ethers";
import UserStore from "../stores/UserStore";
import axios from "axios";
import AppConfig from "../AppConfig";
import { NativeModules } from "react-native";
import TxSignPrep from "../model/TxSignPrep";


const provider = ethers.getDefaultProvider(NetworkManager?.getEnv()?.zkSyncEra);


export default useConvert = () => {

    const [networkChainId, setNetworkChainId] = useState(null);

    useEffect(() => {
        async function loadChainId() {
            try {
                const network = await provider.getNetwork();
                setNetworkChainId(network?.chainId)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        loadChainId();
        return () => { }
    }, []);

    const getTypedMessage = (convertData) => {
        const EIP712Domain = [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' }
        ];
        const domain = {
            name: 'zkSync',
            version: '2',
            chainId: networkChainId,
        };
        const types = {
            EIP712Domain,
            Convert: [
                { name: 'ndau_Address', type: 'address' },
                { name: 'npay_Address', type: 'address' },
                { name: 'amount', type: 'uint' },
                { name: 'nonce', type: 'unint' }
            ],
        };
        const EIP712Msg = {
            domain,
            types,
            primaryType: "Convert",
            message: convertData
        }
        const typedData = JSON.stringify(EIP712Msg);
        return typedData;
    }

    const sigedErcWallet = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (UserStore?.getActiveWallet()?.ercKeys?.privateKey) {
                    const wallet = new ethers.Wallet(UserStore?.getActiveWallet()?.ercKeys?.privateKey);
                    const getData = getTypedMessage(data)
                    const signature1 = await wallet?.signMessage(getData);
                    // const signature2 = await wallet?.signMessage(JSON.stringify(data?.npay_adddress));
                    // let sig = ethers.utils.splitSignature(signature);
                    // const { r, s, v } = sig;
                    // const recoveredAddress = ethers.utils.verifyMessage(getData, signature); // recovered the message
                    let result = {
                        sig2: false,
                        signature1: signature1,
                        chainId: networkChainId
                    }
                    resolve(result)
                } else {
                    const getData = getTypedMessage(data)
                    const preparedTransaction = new TxSignPrep().prepare(getData)
                    const base64EncodedPrepTx = preparedTransaction.b64encode()

                    await NativeModules.KeyaddrManager.sign(
                        "npvta8jaftcjec82cwc2rr7jbugdha8dtrux4yhcsyu424vqitgkapgn8zmyk4826bz433usaaaaaez33e2kkjru8y6wu2u28vxkk6s77wwxszd6fm49tvzmh36znnxbgdydhux82bns",
                        base64EncodedPrepTx
                    ).then((res) => {
                        let result = {
                            sig2: true,
                            signature2: res,
                            chainId: networkChainId
                        }
                        resolve(result)
                    }).catch(err => {
                        reject(err)
                    }
                    );
                }


            } catch (error) {
                reject(error)
            }
        })
    }

    const ndauConversion = (data) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(AppConfig.NDAU_NPAY_CONVERSION, data).then(response => {
                    resolve(response?.data)

                }).catch(error => {
                    reject(error)
                })
            } catch (error) {
                reject(error)
            }

        })
    }



    return {
        sigedErcWallet,
        ndauConversion
    }

}