import { useEffect, useState } from "react";
import { NetworkManager } from "../helpers/EthersScanAPI";
import { ethers } from "ethers";
import UserStore from "../stores/UserStore";


export default useConvert = () => {

    const wallet = new ethers.Wallet(UserStore?.getActiveWallet()?.ercKeys?.privateKey);
    const provider = ethers.getDefaultProvider(NetworkManager?.getEnv()?.zkSyncEra);
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

        const Convert = `Convert a payment of ${10} NDAU to the NPAY`;

        const domain = {
            name: 'zkSync',
            version: '2',
            chainId: networkChainId,
        };

        const types = {
            EIP712Domain,
            [Convert]: [
                { name: 'ndau_Address', type: 'address' },
                { name: 'npay_Address', type: 'address' },
                { name: 'amount', type: 'uint' },
                { name: 'nonce', type: 'unint' }
            ],
        };
        const EIP712Msg = {
            domain,
            types,
            primaryType: Convert,
            message: convertData
        } 
        const typedData = JSON.stringify(EIP712Msg);

        return typedData;

    }

    const sigedErcWallet = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const getData = getTypedMessage(data)
                const signature = await wallet.signMessage(getData);
                let sig = ethers.utils.splitSignature(signature);
                const { r, s, v } = sig;

                const recoveredAddress = ethers.utils.verifyMessage(getData, signature); // recovered the message

                let result = {
                    // signerAddress: signature,
                    // sig,
                    // data: {
                    //     rr: r,
                    //     ss: s,
                    //     vv: v
                    // }
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
    }

}