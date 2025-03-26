import { expect } from "chai";
import { transformObservationInformation } from "../../imports/api/Fhir/Server/FhirUtils.js";


describe('transformObservationInformation', function() {
    it('should return null if observation is null', function() {
        const result = transformObservationInformation(null);
        expect(result).to.be.null;
    });
});
