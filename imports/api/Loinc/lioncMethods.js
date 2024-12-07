import { Meteor } from 'meteor/meteor';
import loincData from './fullLoinc.json';

Meteor.methods({
    'loinc.search'(code) {
        if (!code) {
            throw new Meteor.Error('missing-argument', 'A LOINC code is required.');
        }

        const result = loincData[code];
        if (!result) {
            throw new Meteor.Error('not-found', 'LOINC code not found.');
        }

        return result;
    }
});

/*
EXAMPLE USAGE
Meteor.call('loinc.search', LOINC_CODE, (err, res) => {
    if (err) {
        err handling
    } else {
        process output
    }
})

OUTPUT
{
    longname: 'Body weight', 
    shortname: 'Weight'
}
*/