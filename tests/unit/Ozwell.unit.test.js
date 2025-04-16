import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import '../../imports/api/Ozwell/ozwellMethods.js';
import * as openaiMethods from '../../imports/api/OpenAI/openaiMethods.js';

if (Meteor.isServer) {
    describe('OzwellAI', function () {
        let methodCall;
        let fetchStub;

        // helper to call meteor functions
        before(function () {
            methodCall = (methodName, ...args) =>
                new Promise((resolve, reject) => {
                    Meteor.call(methodName, ...args, (err, res) => {
                        if (err) reject(err);
                        else resolve(res);
                    });
                });
        });

        beforeEach(function () {
            fetchStub = sinon.stub(global, 'fetch');
            sinon.stub(openaiMethods, 'callOpenAI').resolves({ min: 30, max: 40 });
        });

        afterEach(function () {
        fetchStub.restore();
        openaiMethods.callOpenAI.restore();
        sinon.restore();
        });

        // ------------------------------------------------------------------------
        // 1) ozwell.getMinMax
        // ------------------------------------------------------------------------
        it('ozwell.getMinMax returns correct data from Ozwell (no fallback)', async function () {
            // mocking a success response from ozwell
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                    choices: [
                        {
                        message: {
                            content: JSON.stringify({ min: 10, max: 20 }),
                        },
                        },
                    ],
                }),
            });

            // calling the stubbed function
            const result = await methodCall('ozwell.getMinMax', 'BMI', {
                age: 40,
                gender: 'male',
                weight: 80,
                height: 180,
            });

            // these are to check if the output from the tests are expected
            expect(result.status).to.equal('success')
            expect(result.data.min).to.equal(10)
            expect(result.data.max).to.equal(20)

            // the call didnt fail, so dont call openai
            expect(openaiMethods.callOpenAI.called).to.be.false;
        });

        it('ozwell.getMinMax throws error if missing min or max', async function () {
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                choices: [
                    { message: { content: JSON.stringify({ min: 10 }) } },
                ],
                }),
            })

            try {
                await methodCall('ozwell.getMinMax', 'BMI', {
                age: 40,
                gender: 'male',
                weight: 80,
                height: 180,
                });
                expect.fail('Expected method to throw an error');
            } catch (err) {
                expect(err.error).to.equal('invalid-data');
            }
        });

        // ------------------------------------------------------------------------
        // 2) ozwell.getRecommended
        // ------------------------------------------------------------------------
        it('ozwell.getRecommended returns data from Ozwell (no fallback)', async function () {
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                choices: [
                    {
                    message: {
                        content: JSON.stringify({ recommended: 77 }),
                    },
                    },
                ],
                }),
            })

            const result = await methodCall('ozwell.getRecommended', 'BMI', {
                age: 40,
                gender: 'male',
            })

            expect(result.status).to.equal('success');
            expect(result.data.recommended).to.equal(77);
            expect(openaiMethods.callOpenAI.called).to.be.false;
        });

        it('ozwell.getRecommended throws if missing recommended', async function () {
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                choices: [
                    { message: { content: JSON.stringify({}) } },
                ],
                }),
            })

            try {
                await methodCall('ozwell.getRecommended', 'BMI', {
                age: 40,
                gender: 'male',
                });
                expect.fail('Expected method to throw');
            } catch (err) {
                expect(err.error).to.equal('indalid-data');
            }
        });

        // ------------------------------------------------------------------------
        // 3) ozwell.getSummary
        // ------------------------------------------------------------------------
        it('ozwell.getSummary returns summary from Ozwell (no fallback)', async function () {
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                choices: [
                    {
                    message: {
                        content: JSON.stringify({ summary: 'test' }),
                    },
                    },
                ],
                }),
            });

            sinon.stub(Meteor, 'callAsync')
            .withArgs('patient.getSummaryMetrics', 1).resolves({
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

            const result = await methodCall('ozwell.getSummary', 1);
            expect(result.status).to.equal('success');
            expect(result.data.summary).to.equal('test');
            expect(openaiMethods.callOpenAI.called).to.be.false;
        });

        it('ozwell.getSummary throws if missing summary', async function () {
            fetchStub.resolves({
                ok: true,
                json: async () => ({
                    choices: [
                        { message: { content: JSON.stringify({}) } },
                    ],
                }),
            });

            sinon.stub(Meteor, 'callAsync')
            .withArgs('patient.getSummaryMetrics', 1).resolves({
                weightMetrics: [{ valueQuantities: [{ value: 80 }] }],
                heightMetrics: [{ valueQuantities: [{ value: 180 }] }],
                systolicMetrics: [{ valueQuantities: [{ value: 120 }] }],
                diastolicMetrics: [{ valueQuantities: [{ value: 80 }] }],
                heartRateMetrics: [{ valueQuantities: [{ value: 70 }] }],
                BMIMetrics: [{ valueQuantities: [{ value: 24 }] }],
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

            try {
                await methodCall('ozwell.getSummary', 1);
                expect.fail('Expected method to throw');
            } catch (err) {
                expect(err.error).to.equal('invalid-data');
                expect(err.reason).to.match(/does not contain a summary/i);
            }
        });
    });
}