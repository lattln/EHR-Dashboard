// src/components/DemoLabResult.js
import React, { useState } from 'react';
import LabsResult from '../../DashboardPatient/Components/LabsResult'

const fakeLab = {
    loincText: 'Complete blood count (hemogram) panel – Blood by Automated count',
    dateIssued: '2024-05-01T00:00:00Z',
    observations: [
        {
            loincText: 'Leukocytes [#/volume] in Blood by Automated count',
            valueQuantities: [{ value: 55, unit: '%' }],
        },
        {
            loincText: 'Hematocrit [Volume Fraction] of Blood by Automated count',
            valueQuantities: [{ value: 38, unit: '%' }],
        },
        {
            loincText: 'MCV [Entitic volume] by Automated count',
            valueQuantities: [{ value: 83, unit: 'fL' }],
        },
    ],
};

export default function DemoLabResult() {
    // we keep it open so you can see it
    const [open, setOpen] = useState(true);

    return (
        <LabsResult
            isOpen={open}
            onClose={() => setOpen(false)}
            selectedLab={fakeLab}
            inline={true}
        />
    );
}
