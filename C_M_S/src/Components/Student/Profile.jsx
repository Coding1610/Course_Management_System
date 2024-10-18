import React, { useState } from 'react'
import { PencilIcon, CheckIcon } from 'lucide-react'

// Mock student data
const initialStudentData = {
  enrollment: 12345,
  FirstName: "John",
  LastName: "Doe",
  Email: "john.doe@example.com",
  Contact: 1234567890,
  Gender: "Male",
  AadharNumber: 123456789012,
  GuardianNumber: 9876543210,
  GuardianEmail: "guardian@example.com",
  Other: {
    isPhysicalHandicap: false,
    birthPlace: "New York",
    AdmissionThrough: "Regular",
    CasteCategory: "General",
  },
  Branch: "Computer Science",
  Address: {
    Addr: "123 Main St",
    City: "Anytown",
    State: "State",
    Country: "Country",
    PinCode: 123456
  },
  ClassAttended: 45,
}

export default function ProfilePage() {
  const [student, setStudent] = useState(initialStudentData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(student)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setEditedData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setEditedData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStudent(editedData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[98%] mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50">
          <div className="flex items-center mb-4 sm:mb-0">
            <img
              src="data:image/png;base64,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"
              alt="Student"
              className="w-20 h-20 rounded-full mr-4 object-cover"
            />
            <h1 className="text-2xl font-semibold text-gray-900">Student Profile</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <ProfileField
                label="First Name"
                name="FirstName"
                value={student.FirstName}
                readOnly
              />
              <ProfileField
                label="Last Name"
                name="LastName"
                value={student.LastName}
                readOnly
              />
              <ProfileField
                label="Email"
                name="Email"
                value={editedData.Email}
                onChange={handleInputChange}
                isEditing={isEditing}
                type="email"
              />
              <ProfileField
                label="Contact"
                name="Contact"
                value={editedData.Contact}
                onChange={handleInputChange}
                isEditing={isEditing}
                type="tel"
              />
              <ProfileField
                label="Gender"
                name="Gender"
                value={student.Gender}
                readOnly
              />
              <ProfileField
                label="Aadhar Number"
                name="AadharNumber"
                value={editedData.AadharNumber}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="Guardian Number"
                name="GuardianNumber"
                value={editedData.GuardianNumber}
                onChange={handleInputChange}
                isEditing={isEditing}
                type="tel"
              />
              <ProfileField
                label="Guardian Email"
                name="GuardianEmail"
                value={editedData.GuardianEmail}
                onChange={handleInputChange}
                isEditing={isEditing}
                type="email"
              />
              <ProfileField
                label="Branch"
                name="Branch"
                value={student.Branch}
                readOnly
              />
              <ProfileField
                label="Address"
                name="Address.Addr"
                value={editedData.Address.Addr}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="City"
                name="Address.City"
                value={editedData.Address.City}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="State"
                name="Address.State"
                value={editedData.Address.State}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="Country"
                name="Address.Country"
                value={editedData.Address.Country}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="Pin Code"
                name="Address.PinCode"
                value={editedData.Address.PinCode}
                onChange={handleInputChange}
                isEditing={isEditing}
              />
              <ProfileField
                label="Classes Attended"
                name="ClassAttended"
                value={student.ClassAttended}
                readOnly
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ label, name, value, onChange, isEditing, type = "text", readOnly = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {isEditing && !readOnly ? (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        ) : (
          <p className="text-sm text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )
}