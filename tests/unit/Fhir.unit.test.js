import { expect } from "chai";
import sinon from 'sinon';
import { fhirClient } from "../../imports/api/Fhir/Server/fhirclient.js";

import {
    transformObservationInformation,
    transformDiagonosticReportInformation,
    getPatientObservation,
    findPatientByInfo,
    getPatientHealthMetrics,
    getRecentPatientLabs,
    getPatientRecordByID
} from "../../imports/api/Fhir/Server/FhirUtils.js";


describe('transformObservationInformation', function() {
    it('should return null if observation is null', function() {
        const result = transformObservationInformation(null);
        expect(result).to.be.null;
    });
});

describe("FHIR Service Functions", function () {
    let fhirStub;

    beforeEach(() => {
        fhirStub = sinon.stub(fhirClient, "read");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("getPatientRecordByID", function () {
        it("should return a patient record with an age", async function () {
            const mockPatient = { id: "123", birthDate: "1980-01-01" };
            fhirStub.resolves(mockPatient);

            const result = await getPatientRecordByID("123");
            expect(result).to.have.property("age").that.is.a("number");
            expect(result.id).to.equal("123");
        });

        it("should return 'unknown' age if birthdate is missing", async function () {
            const mockPatient = { id: "123" };
            fhirStub.resolves(mockPatient);

            const result = await getPatientRecordByID("123");
            expect(result.age).to.equal("unknown");
        });
    });

    describe("findPatientByInfo", function () {
        it("should return -1 if no patient is found", async function () {
            sinon.stub(fhirClient, "search").resolves({ total: 0 });

            const result = await findPatientByInfo({
                patientGivenName: "John",
                patientFamilyName: "Doe",
                patientPhoneNumber: "555-1234",
                patientDOB: "1990-01-01"
            });

            expect(result).to.equal(-1);
        });

        it("should return a single patient ID when one match is found", async function () {
            sinon.stub(fhirClient, "search").resolves({
                total: 1,
                entry: [{ resource: { id: "456" } }]
            });

            const result = await findPatientByInfo({
                patientGivenName: "John",
                patientFamilyName: "Doe",
                patientPhoneNumber: "555-1234",
                patientDOB: "1990-01-01"
            });

            expect(result).to.equal(456);
        });

        it("should return multiple patient IDs when multiple matches are found", async function () {
            sinon.stub(fhirClient, "search").resolves({
                total: 2,
                entry: [{ resource: { id: "456" } }, { resource: { id: "789" } }]
            });

            const result = await findPatientByInfo({
                patientGivenName: "John",
                patientFamilyName: "Doe",
                patientPhoneNumber: "555-1234",
                patientDOB: "1990-01-01"
            });

            expect(result).to.deep.equal([456, 789]);
        });
    });

    describe("getPatientObservation", function () {
        it("should return an observation when given an ID", async function () {
            const mockObservation = { id: "obs1", resourceType: "Observation" };
            fhirStub.resolves(mockObservation);

            const result = await getPatientObservation("obs1");
            expect(result).to.deep.equal(mockObservation);
        });

        it("should throw an error when the request fails", async function () {
            fhirStub.rejects(new Error("FHIR request failed"));

            try {
                await getPatientObservation("obs1");
            } catch (error) {
                expect(error.message).to.equal("FHIR request failed");
            }
        });
    });

    describe("transformObservationInformation", function () {
        it("should transform observation data correctly", function () {
            const mockObservation = {
                resourceType: "Observation",
                code: { text: "Blood Pressure", coding: [{ code: "12345" }] },
                issued: "2024-01-01T00:00:00Z",
                valueQuantity: { value: 120, unit: "mmHg" }
            };

            const result = transformObservationInformation(mockObservation);
            expect(result.loincCode).to.equal("12345");
            expect(result.loincText).to.equal("Blood Pressure");
            expect(result.dateIssued).to.equal("2024-01-01T00:00:00Z");
            expect(result.valueQuantities).to.deep.equal([{ value: 120, unit: "mmHg" }]);
        });

        it("should return null for invalid input", function () {
            expect(transformObservationInformation(null)).to.be.null;
            expect(transformObservationInformation({ resourceType: "Patient" })).to.be.null;
        });
    });


    describe("getPatientHealthMetrics", function () {
        it("should return health metrics for a patient", async function () {
            sinon.stub(fhirClient, "search").resolves({
                total: 1,
                entry: [{
                    resource: {
                        resourceType: "Observation",
                        code: { coding: [{ code: "12345", display: "Blood Pressure" }] },
                        valueQuantity: { value: 120, unit: "mmHg" }
                    }
                }]
            });

            const result = await getPatientHealthMetrics("12345", "123", 1, 5);
            expect(result).to.be.an("array").with.lengthOf(1);
            expect(result[0].loincCode).to.equal("12345");
        });
    });

    describe("getRecentPatientLabs", function () {
        it("should return recent labs", async function () {
            sinon.stub(fhirClient, "search").resolves({
                total: 1,
                entry: [{
                    resource: {
                        resourceType: "DiagnosticReport",
                        code: { coding: [{ code: "67890", display: "Lab Report" }] },
                        issued: "2024-01-01T00:00:00Z",
                        result: [{ reference: "Observation/1" }]
                    }
                }]
            });

            const result = await getRecentPatientLabs("123", 1, 5);
            expect(result).to.be.an("array").with.lengthOf(1);
            expect(result[0].loincCode).to.equal("67890");
        });
    });
});
