import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import Temp from "../Temp.json";

const Card = ({ children, className }) => (
  <div className={`p-6 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ heading: '', description: '', date: '' });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDeadline({ ...newDeadline, [name]: value });
  };

  // Open and close popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Post the new deadline to the backend
    try {
      const response = await fetch('/api/deadlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeadline),
      });

      if (response.ok) {
        console.log('Deadline added successfully!');
        // Refresh or update the state to show the new deadline
      } else {
        console.error('Error adding deadline');
      }
    } catch (error) {
      console.error('Failed to connect to backend', error);
    }

    // Close the popup after submission
    togglePopup();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(Temp);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Error loading dashboard data</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-custom-blue">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 ">Semester</span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{data.semester}</div>
            <p className="text-xs text-gray-500">{data.year}</p>
          </Card>
          <Card className="bg-custom-pink">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Completed Courses</span>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{data.completedCourses}</div>
            <p className="text-xs text-gray-500">{data.remainingCourses} Remaining</p>
          </Card>
          <Card className="bg-custom-purple">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Upcoming Quiz</span>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{data.upcomingQuizzes}</div>
            <p className="text-xs text-gray-500">Click here to know more</p>
          </Card>
          <Card className="bg-custom-yellow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Classes Attended</span>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{data.classesAttended}</div>
            <p className="text-xs text-gray-500">This semester</p>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-6">{data.course}, {data.courseId}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-custom-darkPink">
            <h3 className="text-lg font-semibold mb-4">Semester Progress</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-blue-500 progress-ring stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.semesterProgress / 100)}`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{data.semesterProgress}%</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">{data.completedLectures}/{data.totalLectures}</p>
              <p className="text-sm text-gray-500">Lectures</p>
            </div>
          </Card>
          <Card className="bg-custom-darkPink">
            <h3 className="text-lg font-semibold mb-4">Upcoming Evaluations</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-semibold">Type</th>
                  <th className="text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingEvaluations.map((evalItem, index) => (
                  <tr key={index}>
                    <td>{evalItem.type}</td>
                    <td>{evalItem.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div>
          <Card className="mb-8 bg-custom-red">
           <div className='flex justify-between'> <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
            <button onClick={togglePopup} className="mb-4 p-2 bg-custom-selectedPurple text-white rounded">
              Add
            </button></div>
            {data.upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
                <div>
                  <h4 className="font-semibold">{deadline.heading}</h4> {/* Added heading */}
                  <p className="text-sm text-gray-500">{deadline.description}</p> {/* Added description */}
                  <p className="text-sm text-gray-500">{deadline.date}</p>
                </div>
                <button className="p-2 bg-gray-100 rounded-full">
                  <ChevronDown size={20} />
                </button>
              </div>
            ))}
          </Card>

          {/* Popup for adding new deadline */}
          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add New Deadline</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="heading">
                      Heading
                    </label>
                    <input
                      type="text"
                      name="heading"
                      id="heading"
                      className="w-full p-2 border rounded"
                      value={newDeadline.heading}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="w-full p-2 border rounded"
                      value={newDeadline.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="date">
                      Deadline Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="w-full p-2 border rounded"
                      value={newDeadline.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-300 p-2 rounded mr-2"
                      onClick={togglePopup}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Add Deadline
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
