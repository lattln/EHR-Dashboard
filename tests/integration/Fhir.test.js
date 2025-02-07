import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';

describe('Meteor Methods - Patient Data', function () {
	it('should fetch BMI metrics for a patient', async function () {
		const result = await Meteor.callPromise('patient.getBMIMetrics', 1);
		assert.isArray(result);
	});

	it('should throw an error for missing patientID', async function () {
		try {
		await Meteor.callPromise('patient.getBMIMetrics', null);
		} catch (error) {
		assert.equal(error.error, 400);
		}
	});

	it('should return empty result when patient record is not found', async function () {
		const result = await Meteor.callPromise('patient.getRecordByIdentifier', 'non-existing-identifier');
		assert.isObject(result);
		assert.isUndefined(result.entry);
	});
});
