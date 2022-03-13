const functions = require("firebase-functions");
const { db } = require("./initialize");

function handleUnitChange(change) {
	const unitBefore = change.before.data();
	if (unitBefore.type !== "GROUP") {
		// only changes on groups are handled by this function
		return false;
	}
	const unitAfter = change.after.data();

	const stateBefore = unitBefore.state;
	const stateAfter = unitAfter.state;

	if (JSON.stringify(stateBefore) === JSON.stringify(stateAfter)) {
		// only state changes get processed
		return false;
	}

	const lampUpdates = unitAfter.lamps.map((lampId) =>
		db.collection("units").doc(lampId).update({ state: stateAfter })
	);
	return Promise.all(lampUpdates);
}

exports = module.exports = functions
	.region("europe-west1")
	.runWith({
		timeoutSeconds: 30,
		memory: "128MB",
	})
	.firestore.document("units/{unitId}")
	.onUpdate(handleUnitChange);
