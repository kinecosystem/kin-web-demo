"use strict";
(async function(KinSdk, KeystoreProvider) {
	let keyStoreProvider = new KeystoreProvider(KinSdk);

	let kinClient = new KinSdk.KinClient(
		KinSdk.Environment.Testnet,
		keyStoreProvider
	);

	let accounts = await kinClient.kinAccounts;
	switch (accounts.length){
		case 2: 
			break;
		case 0:
			await keyStoreProvider.addKeyPair();
		case 1:
			await keyStoreProvider.addKeyPair();
		default:
			accounts = await kinClient.kinAccounts;
			break;
	}
	
	const transactionId = await kinClient.friendbot({
		address: accounts[0].publicAddress,
		amount: 1000,
	});
	
	const secondTransactionId = await kinClient.friendbot({
		address: accounts[1].publicAddress,
		amount: 1000,
	});

	const transaction = await accounts[0].buildTransaction({
		address: accounts[1].publicAddress,
		amount: 1,
		fee: 100,
		memoText: "Send some kin",
	});

	await accounts[0].submitTransaction(transaction.toString());

	const senderBalance = await accounts[0].getBalance();
	const receiverBalance = await accounts[1].getBalance();

	console.log(senderBalance);
	console.log(receiverBalance);
	
})(window.KinSdk, window.KeystoreProvider);
