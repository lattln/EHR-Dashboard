import {
    getPatientHealthMetrics,
    getRecentPatientLabs
} from '../../Fhir/Server/FhirUtils.js';

import { LOINC_MAPPING } from '../../Loinc/loincConstants.js';

export async function generateAllPatientChunks(patientId) {
    const chunks = [];

    // --- LOINC METRICS ---
    const loincCodes = [
        LOINC_MAPPING.BODY_WEIGHT,
        LOINC_MAPPING.BODY_HEIGHT,
        LOINC_MAPPING.BODY_BMI,
        LOINC_MAPPING.BODY_HEART_RATE,
        LOINC_MAPPING.BODY_TEMP,
        LOINC_MAPPING.BODY_OXYGEN_SATURATION,
        LOINC_MAPPING.HEMOGLOBIN_HGB,
        LOINC_MAPPING.HEMOGLOBIN_A1C,
        LOINC_MAPPING.GLUCOSE_SERUM_PLASMA,
        LOINC_MAPPING.CREATININE,
        LOINC_MAPPING.CHOLESTEROL_TOTAL
    ];

    for (const code of loincCodes) {
        const metrics = await getPatientHealthMetrics(code, patientId, 1, 100);
        for (const metric of metrics) {
            for (const value of metric.valueQuantities) {
                chunks.push({
                    text: `Metric: ${metric.loincText} (${metric.loincCode}) — Value: ${value.value} ${value.unit}, Date: ${metric.dateIssued}`,
                    metadata: {
                        patientId,
                        type: 'LOINC_Metric',
                        loincCode: metric.loincCode
                    }
                });
            }
        }
    }

    // --- RECENT DIAGNOSTIC REPORTS ---
    const labs = await getRecentPatientLabs(patientId, 1, 5);
    for (const report of labs) {
        const observationSummaries = report.observations.map(obs =>
            obs.valueQuantities?.map(val =>
                `${obs.loincText} (${obs.loincCode}) = ${val.value} ${val.unit}`
            ).join(', ')
        ).join('; ');

        chunks.push({
            text: `Lab Report (${report.loincText}): Date: ${report.dateIssued}. Observations: ${observationSummaries}`,
            metadata: {
                patientId,
                type: 'LabPanel',
                loincCode: report.loincCode
            }
        });
    }

    return chunks;
}
