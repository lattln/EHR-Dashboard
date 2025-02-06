import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import sinon from 'sinon';

import {
    transformObservationInformation,
    transformDiagonosticReportInformation,
    getPatientObservation,
    findByInfo,
    getPatientHealthMetrics,
    getRecentPatientLabs,
    getPatientRecordByID
} from '/imports/api/Fhir/fhirMethods.js';

describe('FHIR Data Functions', function () {
    describe('transformObservationInformation', function () {
        it('Should return null if the resourec is null', function () {
            const result = transformObservationInformation(null);
            assert.isNull(result, 'Expected null when observation is null')
        })
    })
})