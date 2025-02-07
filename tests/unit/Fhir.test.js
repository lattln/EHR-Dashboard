import { assert } from 'chai';
import { transformObservationInformation } from '../../imports/api/Fhir/fhirMethods.js';

describe('transformObservationInformation', function () {
    it('should return an empty array when response is empty', function () {
        const result = transformObservationInformation(null);
        assert.deepEqual(result, []);
    });

    it('should correctly transform valid FHIR observation data', function () {
        const response = {
        entry: [
            { resource: { issued: '2024-01-01', valueQuantity: { value: 120 } } },
            { resource: { issued: '2024-01-02', valueQuantity: { value: 125 } } }
        ]
        };
        const expected = [
        { dateIssued: '2024-01-01', valueQuantity: { value: 120 } },
        { dateIssued: '2024-01-02', valueQuantity: { value: 125 } }
        ];
        const result = transformObservationInformation(response);
        assert.deepEqual(result, expected);
    });

    it('should return an empty array if response has no entries', function () {
        const response = { total: 0, entry: [] };
        const result = transformObservationInformation(response);
        assert.deepEqual(result, []);
    });
});
