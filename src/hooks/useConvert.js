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

        console.log(Object.keys(NativeModules.KeyaddrManager) ,'modules---')

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
                { name: 'nonce', type: 'unint' },
                { name: 'signature2', type: 'string' },
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



    const signedNdau = (ndauKey, data) => {
        return new Promise((resolve, reject) => {
            const preparedTransaction = new TxSignPrep().prepare(data)
            const base64EncodedPrepTx = preparedTransaction.b64encode()
            NativeModules.KeyaddrManager.sign(
                ndauKey,
                base64EncodedPrepTx
            ).then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            }
            );
        })
    }

    const sigedErcWallet = (data, ndauKey) => {

        return new Promise(async (resolve, reject) => {
            try {
                if (UserStore?.getActiveWallet()?.ercKeys?.privateKey) {
                    const wallet = new ethers.Wallet(UserStore?.getActiveWallet()?.ercKeys?.privateKey);
                    const nonceVal = await provider.getTransactionCount(data?.npay_address);
                    const signature2 = await signedNdua(ndauKey, JSON.stringify(data?.npay_address))
                    data.signature2 = signature2
                    data.nonceVal = nonceVal

                    const getData = getTypedMessage(data)


                    const signature1 = await wallet?.signMessage(getData);
                    // const signature2 = await wallet?.signMessage(JSON.stringify(data?.npay_adddress));
                    // let sig = ethers.utils.splitSignature(signature);
                    // const { r, s, v } = sig;
                    // const recoveredAddress = ethers.utils.verifyMessage(getData, signature); // recovered the message
                    let result = {
                        signature1: signature1,
                        signature2: signature2,
                        chainId: networkChainId,
                        nonceVal: nonceVal
                    }
                    resolve(result)
                } else {
                    const signature2 = await signedNdau(ndauKey, JSON.stringify(data?.npay_address))
                    data.signature2 = signature2
                    const nonceVal = await provider.getTransactionCount(data?.npay_address);
                    const getData = getTypedMessage(data)
                    const signature1 = await signedNdau(ndauKey, JSON.stringify(getData))

                    let result = {
                        signature1: signature1,
                        signature2: signature2,
                        chainId: networkChainId,
                        nonceVal: nonceVal
                    }
                    resolve(result)
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