import React from 'react'

const Tasks = () => {
    return (
        <div className="flex h-screen">

            {/* Main Content */}
            <div className="flex-1 p-6 min-h-screen bg-gray-100 overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Task Overview</h2>
                    <p className="text-sm text-gray-600">Active tasks assigned to you or your team</p>
                </div>

                <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-100 text-blue-900">
                            <tr>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Patient</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Details</th>
                                <th className="px-4 py-2">Created</th>
                                <th className="px-4 py-2">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2 text-blue-700 font-medium">Not Started</td>
                                <td className="px-4 py-2">Charles Williams</td>
                                <td className="px-4 py-2">Complete Blood Count</td>
                                <td className="px-4 py-2">Hydrocortisone Inj.</td>
                                <td className="px-4 py-2">9/6/2022</td>
                                <td className="px-4 py-2">Cathy Williams</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 text-green-600 font-medium">Completed</td>
                                <td className="px-4 py-2">Marshall Sons</td>
                                <td className="px-4 py-2">Surgery</td>
                                <td className="px-4 py-2">Bunion</td>
                                <td className="px-4 py-2">9/6/2022</td>
                                <td className="px-4 py-2">Jacob Jones</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 text-yellow-600 font-medium">In Progress</td>
                                <td className="px-4 py-2">Sora Stone</td>
                                <td className="px-4 py-2">X-ray</td>
                                <td className="px-4 py-2">Right Ankle</td>
                                <td className="px-4 py-2">9/6/2022</td>
                                <td className="px-4 py-2">Cathy Williams</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

export default Tasks