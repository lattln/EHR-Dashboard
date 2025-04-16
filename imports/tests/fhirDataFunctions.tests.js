import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { fhirClient } from '../api/Fhir/Server/fhirclient.js';
import sinon from 'sinon';

import {
    transformObservationInformation,
    transformDiagonosticReportInformation,
    getPatientObservation,
    findByInfo,
    getPatientHealthMetrics,
    getRecentPatientLabs,
    getPatientRecordByID
} from '/imports/api/Fhir/Server/FhirUtils.js';

describe('FHIR Data Functions', function () {
    describe('transformObservationInformation', function () {
        it('Should return null if the resource is null', function () {
            const result = transformObservationInformation(null);
            assert.isNull(result, 'Expected null when observation is null')
        })
    })
})


