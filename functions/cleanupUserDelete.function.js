const functions = require("firebase-functions");
const { db } = require("./initialize");

async function handleUserDelete({ uid }) {
	const snapUnits = await db
		.collection("units")
		.where("created_by", "==", uid)
		.get();
	const snapStates = await db
		.collection("states")
		.where("created_by", "==", uid)
		.get();
	const batch = db.batch();
	snapUnits.docs.forEach((doc) => batch.delete(doc.ref));
	snapStates.docs.forEach((doc) => batch.delete(doc.ref));
	await batch.commit();
	console.log(`deleted ${snapUnits.docs.length} units`);
	console.log(`deleted ${snapStates.docs.length} states`);
	await db
		.collection("users")
		.doc(uid)
		.delete();
	console.log(`deleted user ${uid}`);
}

exports = module.exports = functions.auth.user().onDelete(handleUserDelete);
