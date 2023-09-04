import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CustomText from "../components/CustomText";
import Loading from "../components/Loading";
import ScreenContainer from "../components/Screen";
import { useTransaction } from "../hooks";

const Transactions = (props) => {
	const { item } = props?.route?.params ?? {};
	const { getTransactions } = useTransaction();
	const [transactions, setTranstions] = useState([]);

	const [loading, setLoading] = useState("");

	useEffect(() => {
		getTransactionsFoNDAU();
	}, [])

	const getTransactionsFoNDAU = () => {
		setLoading("Getting transactions")
		getTransactions(item.address).then(res => {
			setLoading("")
			setTranstions(res?.Items || []);
		});
	}

	return (
		<ScreenContainer headerTitle={item.addressData?.nickname}>
			{loading && <Loading label={loading} />}
			<FlatList
				data={transactions}
				keyExtractor={(i, _) => _.toString()}
				renderItem={({ item }) => {
					return (
						<View style={{ borderWidth: 1, marginBottom: 10, borderColor: "white" }}>
							<CustomText>{JSON.stringify(item, null, 2)}</CustomText>
						</View>
					)
				}}
			/>
		</ScreenContainer>
	)
}

const styles = StyleSheet.create({

})

export default Transactions;