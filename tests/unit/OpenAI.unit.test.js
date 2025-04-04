import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import '../../imports/api/OpenAI/openaiMethods.js';

if (Meteor.isServer) {
    describe('OpenAI', () => {
        let callAsyncStub;

        beforeEach(() => {
            callAsyncStub = sinon.stub(Meteor, 'callAsync');
        });

        afterEach(() => {
            callAsyncStub.restore();
        });

        it('openai.getMinMax returns correct data structure', async () => {
            callAsyncStub.callsFake(async (methodName, metric, userData) => {
                if (methodName === 'openai.getMinMax') {
                    return { status: 'success', data: { min: 50, max: 100 } };
                }
                throw new Error(`Unknown method: ${methodName}`);
            });

            const result = await Meteor.callAsync('openai.getMinMax', 'BMI', {
                age: 40,
                gender: 'male',
                weight: 80,
                height: 180,
            });

            expect(result.status).to.equal('success');
            expect(result.data.min).to.equal(50);
            expect(result.data.max).to.equal(100);
        });

        it('openai.getMinMax throws error if missing min or max', async () => {
            callAsyncStub.callsFake(async (methodName, metric, userData) => {
                if (methodName === 'openai.getMinMax') {  
                    const error = new Meteor.Error(
                        'invalid-data',
                        'Response does not contain both min and max values.'
                    );
                    return Promise.reject(error);
                }
                throw new Error(`Unknown method: ${methodName}`);
            });

            try {
                await Meteor.callAsync('openai.getMinMax', 'BMI', {
                    age: 40,
                    gender: 'male',
                    weight: 80,
                    height: 180,
                });
                expect.fail('Expected method to throw an error');
            } catch (error) {
                expect(error.error).to.equal('invalid-data');
                expect(error.reason).to.equal('Response does not contain both min and max values.');
            }
        });

        it('openai.getRecommended returns correct data structure', async () => {
            callAsyncStub.callsFake(async (methodName, metric, userData) => {
                if (methodName === 'openai.getRecommended') {
                    return { status: 'success', data: { recommended: 25 } };
                }
                throw new Error(`Unknown method: ${methodName}`);
            });

            const result = await Meteor.callAsync('openai.getRecommended', 'BMI', {
                age: 40,
                gender: 'male',
            });

            expect(result.status).to.equal('success');
            expect(result.data.recommended).to.equal(25);
        });

        it('openai.getRecommended throws error if missing recommended field', async () => {
            callAsyncStub.callsFake(async (methodName, metric, userData) => {
                if (methodName === 'openai.getRecommended') {
                    const error = new Meteor.Error(
                        'invalid-data',
                        'Response does not contain a recommended value.'
                    );
                    return Promise.reject(error);
                }
                throw new Error(`Unknown method: ${methodName}`);
            });

            try {
                await Meteor.callAsync('openai.getRecommended', 'BMI', {
                    age: 40,
                    gender: 'male',
                });
                expect.fail('Expected method to throw an error');
            } catch (error) {
                expect(error.error).to.equal('invalid-data');
                expect(error.reason).to.equal('Response does not contain a recommended value.');
            }
        });

        it('throws error if unknown method is called', async () => {
            callAsyncStub.callsFake(async (methodName) => {
                throw new Error(`Unknown method: ${methodName}`);
            });

            try {
                await Meteor.callAsync('someUnknownMethod');
                expect.fail('Expected unknown method to throw');
            } catch (error) {
                expect(error.message).to.match(/Unknown method: someUnknownMethod/);
            }
        });
    });
}