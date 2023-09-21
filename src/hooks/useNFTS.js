import { Alchemy, Network, NftFilters } from "alchemy-sdk"

import UserStore from "../stores/UserStore";
import { useEffect, useRef } from "react";
import { NetworkManager } from "../helpers/EthersScanAPI";


export default useNFTS = () => {

	const __getData = () => {
		const data = {
			eth: {
				apiKey: NetworkManager.getEnv().eth.split('/').at(-1),
				network: NetworkManager.__isTestnet() ? Network.ETH_GOERLI : Network.ETH_MAINNET
			},
			polygon: {
				apiKey: NetworkManager.getEnv().polygon.split('/').at(-1),
				network: NetworkManager.__isTestnet() ? Network.MATIC_MUMBAI : Network.MATIC_MAINNET
			}
		}
		return data;
	}

	const alchemyNFTEth = useRef(new Alchemy({ apiKey: __getData().eth.apiKey, network: __getData().eth.network }).nft);
	const alchemyNFTPolygon = useRef(new Alchemy({ apiKey: __getData().polygon.apiKey, network: __getData().eth.network }).nft);

	const __init = () => {
		alchemyNFTEth.current = new Alchemy({ apiKey: __getData().eth.apiKey, network: __getData().eth.network }).nft;
		alchemyNFTPolygon.current = new Alchemy({ apiKey: __getData().polygon.apiKey, network: __getData().polygon.network }).nft;
	}

	const __collectionDecorator = (obj, toAppend = {}) => ({
		...toAppend,
		...obj,
		name: obj.openSea?.collectionName || obj.name || obj.title || "Testnet",
		image: obj.media[0]?.thumbnail,
	})
	const __nftDecorator = (obj, toAppend = {}) => ({
		...toAppend,
		...obj,
		name: obj.name || obj.title,
		image: obj.media[0]?.thumbnail
	})

	const getCollections = () => {
		__init();
		return new Promise(async (resolve, reject) => {

			try {
				const nftsOnEth = await alchemyNFTEth.current.getContractsForOwner(UserStore.getActiveWallet().ercAddress)
				const nftsOnPolygon = await alchemyNFTPolygon.current.getContractsForOwner(UserStore.getActiveWallet().ercAddress)
	
				const nfts = [
					...nftsOnEth.contracts.map((item) => __collectionDecorator(item, { network: __getData().eth.network })),
					...nftsOnPolygon.contracts.map((item) => __collectionDecorator(item, { network: __getData().polygon.network })),
				];

				resolve(nfts);
			} catch(err) {
				console.log('err', JSON.stringify(err.message, null, 2));
				reject(err);
			}
		})
	}

	const getNftOfCollection = (contractAddress) => {
		__init();
		return new Promise(async (resolve, reject) => {
			try {
				const nftsOnEth = await alchemyNFTEth.current.getNftsForOwner(UserStore.getActiveWallet().ercAddress, { contractAddresses: [contractAddress] })
				const nftsOnPolygon = await alchemyNFTPolygon.current.getNftsForOwner(UserStore.getActiveWallet().ercAddress, { contractAddresses: [contractAddress] })
	
				const nfts = [
					...nftsOnEth.ownedNfts.map((item) => __nftDecorator(item, { network: __getData().eth.network })),
					...nftsOnPolygon.ownedNfts.map((item) => __nftDecorator(item, { network: __getData().polygon.network })),
				];

				resolve(nfts);
			} catch(err) {
				console.log('err', JSON.stringify(err.message, null, 2));
				reject(err);
			}
		})
	}

	return {
		getCollections,
		getNftOfCollection
	}
}