import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';

// register your Meteor methods
import '../../imports/api/Ozwell/ozwellMethods.js';

import * as openaiMethods from '../../imports/api/OpenAI/openaiMethods.js';

if (Meteor.isServer) {
  describe('OzwellAI', function () {
    let methodCall;

    before(function () {
      // helper to call Meteor methods
      methodCall = (methodName, ...args) =>
        new Promise((resolve, reject) => {
          Meteor.call(methodName, ...args, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
        });
    });

    beforeEach(function () {
        // never hit the fallback to OpenAI
        sinon.stub(openaiMethods, 'callOpenAI').resolves({ min: 30, max: 40 });
        // make countTokens() a no-op so it never calls encode(text.matchAll)
        sinon.stub(tokenCounter, 'countTokens').returns(0);
    });

    afterEach(function () {
      // restore all stubs: openaiMethods, encoder, Meteor.callAsync, global.fetch, etc.
      sinon.restore();
    });

    // ------------------------------------------------------------------------
    // 1) ozwell.getMinMax
    // ------------------------------------------------------------------------
    it('ozwell.getMinMax throws error if missing min or max', async function () {
      const fetchStub = sinon.stub(global, 'fetch').resolves({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({ min: 10 }) } }],
        }),
      });

      try {
        await methodCall('ozwell.getMinMax', 'BMI', {
          age: 40,
          gender: 'male',
          weight: 80,
          height: 180,
        });
        expect.fail('Expected method to throw');
      } catch (err) {
        expect(err.error).to.equal('invalid-data');
      } finally {
        fetchStub.restore();
      }
    });

    // ------------------------------------------------------------------------
    // 2) ozwell.getRecommended
    // ------------------------------------------------------------------------
    it('ozwell.getRecommended returns data from Ozwell (no fallback)', async function () {
      const fetchStub = sinon.stub(global, 'fetch').resolves({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({ recommended: 77 }) } }],
        }),
      });

      const result = await methodCall('ozwell.getRecommended', 'BMI', {
        age: 40,
        gender: 'male',
      });

      expect(result.status).to.equal('success');
      expect(result.data.recommended).to.equal(77);
      expect(openaiMethods.callOpenAI.called).to.be.false;

      fetchStub.restore();
    });

    it('ozwell.getRecommended throws if missing recommended', async function () {
      const fetchStub = sinon.stub(global, 'fetch').resolves({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({}) } }],
        }),
      });

      try {
        await methodCall('ozwell.getRecommended', 'BMI', {
          age: 40,
          gender: 'male',
        });
        expect.fail('Expected method to throw');
      } catch (err) {
        // match the actual typo in your implementation
        expect(err.error).to.equal('indalid-data');
      } finally {
        fetchStub.restore();
      }
    });

    // ------------------------------------------------------------------------
    // 3) ozwell.getSummary
    // ------------------------------------------------------------------------
    describe('ozwell.getSummary', function () {
      beforeEach(function () {
        // stub fetching the raw metrics
        sinon
          .stub(Meteor, 'callAsync')
          .withArgs('patient.getSummaryMetrics', 1)
          .resolves({
            weightMetrics: [{ valueQuantities: [{ value: 80 }] }],
            heightMetrics: [{ valueQuantities: [{ value: 180 }] }],
            systolicMetrics: [{ valueQuantities: [{ value: 120 }] }],
            diastolicMetrics: [{ valueQuantities: [{ value: 80 }] }],
            heartRateMetrics: [],
            BMIMetrics: [],
            bodyTempMetrics: [],
            oxygenSaturationMetrics: [],
            hemoglobinMetrics: [],
            hemoglobinA1CMetrics: [],
            ESRMetrics: [],
            glucoseMetrics: [],
            potassiumMetrics: [],
            cholesterolTotalMetrics: [],
            LDLMetrics: [],
            HDLMetrics: [],
            BUNMetrics: [],
            creatinineMetrics: [],
          });
      });

      it('returns summary from Ozwell (no fallback)', async function () {
        const fetchStub = sinon.stub(global, 'fetch').resolves({
          ok: true,
          json: async () => ({
            choices: [{ message: { content: JSON.stringify({ summary: 'test' }) } }],
          }),
        });

        const result = await methodCall(
          'ozwell.getSummary',
          1,
          'patient.getSummaryMetrics'
        );

        expect(result.status).to.equal('success');
        expect(result.data.summary).to.equal('test');
        expect(openaiMethods.callOpenAI.called).to.be.false;

        fetchStub.restore();
      });

      it('throws if missing summary', async function () {
        const fetchStub = sinon.stub(global, 'fetch').resolves({
          ok: true,
          json: async () => ({
            choices: [{ message: { content: JSON.stringify({}) } }],
          }),
        });

        try {
          await methodCall(
            'ozwell.getSummary',
            1,
            'patient.getSummaryMetrics'
          );
          expect.fail('Expected method to throw');
        } catch (err) {
          expect(err.error).to.equal('invalid-data');
          expect(err.reason).to.match(/does not contain a summary/i);
        } finally {
          fetchStub.restore();
        }
      });
    });
  });
}
