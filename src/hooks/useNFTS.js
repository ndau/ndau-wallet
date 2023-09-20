import { Alchemy, Network, NftFilters } from "alchemy-sdk"

import UserStore from "../stores/UserStore";
import { useRef } from "react";


export default useNFTS = () => {

	const alchemyNFT = useRef(new Alchemy({ apiKey: "Z_G5HhyiXdXZ9j0-uJ4B7SZr_oCk4xSN", network: Network.MATIC_MAINNET }).nft).current;

	const getCollections = () => {
		return new Promise((resolve, reject) => {
			alchemyNFT.getContractsForOwner(UserStore.getActiveWallet().ercAddress, { excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS] }).then(res => {
				const nftsList = res.contracts.map(obj => ({
					...obj,
					name: obj.openSea?.collectionName || obj.name || obj.title,
					image: obj.media[0]?.thumbnail
				}));
				resolve(nftsList);
			}).catch(err => {
				console.log('err', JSON.stringify(err.message, null, 2));
				reject(err);
			})
		})
	}

	const getNftOfCollection = (contractAddress) => {
		return new Promise((resolve, reject) => {
			alchemyNFT.getNftsForOwner(UserStore.getActiveWallet().ercAddress, { contractAddresses: [contractAddress] }).then(res => {
				const nftsList = res.ownedNfts.map(obj => ({
					...obj,
					name: obj.name || obj.title,
					image: obj.media[0]?.thumbnail
				}));
				resolve(nftsList);
			}).catch(err => {
				console.log('err', JSON.stringify(err.message, null, 2));
				reject(err);
			})
		})
	}

	return {
		getCollections,
		getNftOfCollection
	}
}