import React from "react";

const mockPatients = [
    {
        name: "John Smith",
        age: 37,
        gender: "Male",
        lastVisit: "10/18/2024",
        physician: "Dr. Dre",
    },
    {
        name: "Maria Gomez",
        age: 45,
        gender: "Female",
        lastVisit: "11/02/2024",
        physician: "Dr. Wilson",
    },
    {
        name: "James Lee",
        age: 29,
        gender: "Male",
        lastVisit: "09/25/2024",
        physician: "Dr. Alan Black",
    },
];

export default function PatientList() {
    return (
        <div className="flex-1 p-6 min-h-screen bg-gray-100 overflow-y-auto">
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Patients</h2>
                <p className="text-sm text-gray-600">Patient list with visit history</p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto h-3/4">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-blue-100 text-blue-900">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Age</th>
                            <th className="px-4 py-2">Gender</th>
                            <th className="px-4 py-2">Physician</th>
                            <th className="px-4 py-2">Last Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPatients.map((patient, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium text-blue-700">{patient.name}</td>
                                <td className="px-4 py-2">{patient.age}</td>
                                <td className="px-4 py-2">{patient.gender}</td>
                                <td className="px-4 py-2">{patient.physician}</td>
                                <td className="px-4 py-2">{patient.lastVisit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
