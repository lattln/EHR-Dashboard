if (Meteor.isServer) {
    const { Meteor } = require('meteor/meteor');
    const { expect } = require('chai');
    const sinon = require('sinon');

    const fhirClientModule = require('../../imports/api/Fhir/fhirclient.js');
    const fhirClient = fhirClientModule.fhirClient || (fhirClientModule.default && fhirClientModule.default.fhirClient);
    if (!fhirClient) {
        throw new Error('fhirClient is not exported correctly from ../../imports/api/Fhir/fhirclient.js');
    }

    const callMethod = (methodName, ...params) => {
        return new Promise((resolve, reject) => {
            Meteor.call(methodName, ...params, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    };

    if (Meteor.isServer) {
        describe('Meteor Methods Integration', function() {
        let fhirSearchStub;
        let fhirReadStub;
    
        before(function() {
            fhirSearchStub = sinon.stub(fhirClient, 'search').callsFake((options) => {
            if (options.resourceType === "Observation") {
                return Promise.resolve({
                total: 1,
                entry: [{
                    resource: {
                    resourceType: "Observation",
                    code: {
                        text: "Test Observation",
                        coding: [{ code: "TEST_CODE", display: "Test Display" }]
                    },
                    issued: "2020-01-01T00:00:00Z",
                    valueQuantity: { value: 100, unit: "mg/dL" }
                    }
                }]
                });
            } else if (options.resourceType === "DiagnosticReport") {
                return Promise.resolve({
                total: 1,
                entry: [{
                    resource: {
                    resourceType: "DiagnosticReport",
                    code: { coding: [{ code: "LAB_CODE", display: "Lab Report" }] },
                    issued: "2020-02-01T00:00:00Z",
                    result: [{ reference: "Observation/1" }]
                    }
                }]
                });
            }
            return Promise.resolve({ total: 0 });
            });

            fhirReadStub = sinon.stub(fhirClient, 'read').callsFake((options) => {
            if (options.resourceType === "Observation" && options.id === "1") {
                return Promise.resolve({
                resourceType: "Observation",
                code: {
                    text: "Test Observation",
                    coding: [{ code: "TEST_CODE", display: "Test Display" }]
                },
                issued: "2020-01-01T00:00:00Z",
                valueQuantity: { value: 100, unit: "mg/dL" }
                });
            }
            return Promise.resolve(null);
            });
        });
    
        after(function() {
            if (fhirSearchStub) fhirSearchStub.restore();
            if (fhirReadStub) fhirReadStub.restore();
        });
    
        it('should return health metrics when calling "patient.getHealthMetrics"', async function() {
            const loincCode = "TEST_CODE";
            const patientID = "patient-123";
            const result = await callMethod('patient.getHealthMetrics', loincCode, patientID);
    
            expect(result).to.be.an('array').that.has.lengthOf(1);
            expect(result[0]).to.deep.equal({
            loincText: "Test Observation",
            loincCode: "TEST_CODE",
            dateIssued: "2020-01-01T00:00:00Z",
            valueQuantity: { value: 100, unit: "mg/dL" }
            });
        });
    
        it('should return recent labs when calling "patient.getRecentLabs"', async function() {
            const patientID = "patient-123";
            const labReturnLimit = 10;
            const result = await callMethod('patient.getRecentLabs', patientID, labReturnLimit);

            expect(result).to.be.an('array').that.has.lengthOf(1);
            expect(result[0]).to.have.property('loincCode', "LAB_CODE");
            expect(result[0]).to.have.property('observations').that.is.an('array').with.lengthOf(1);
            expect(result[0].observations[0]).to.deep.equal({
            loincText: "Test Observation",
            loincCode: "TEST_CODE",
            dateIssued: "2020-01-01T00:00:00Z",
            valueQuantity: { value: 100, unit: "mg/dL" }
            });
        });
        });
    }
}