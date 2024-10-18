import React, { useEffect, useState } from 'react'
import { Menu, X, Bell, ChevronDown, Columns2, Mail, CreditCard, Settings, PencilRuler, Users, FileText, GraduationCap } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'


const userRole = localStorage.getItem('userRole')
// sidebar
const menuItemsByRole = {
  "student": [
    { id: 1, label: 'Overview', icon: <Columns2 /> },
    { id: 2, label: 'Inbox', icon: <Mail /> },
    { id: 3, label: 'Fees', icon: <CreditCard /> },
    { id: 4, label: 'Settings', icon: <Settings /> },

  ],
  "faculty": [
    { id: 1, label: 'Dashboard', icon: <Columns2 /> },
    { id: 2, label: 'Messages', icon: <Mail /> },
    { id: 3, label: 'Grades', icon: <PencilRuler /> },
    { id: 4, label: 'Settings', icon: <Settings /> },
  ],
  "academic-admin": [
    { id: 1, key: 'Dashboard', label: 'Overview', icon: <Columns2 />, href: '/academic-admin-dashboard/dashboard' },
    { id: 2, key: 'Dashboard', label: 'Common Forum', icon: <Users />, href: '/academic-admin-dashboard/dashboard' },
    { id: 3, key: 'Dashboard', label: 'Course Forum', icon: <FileText />, href: '/academic-admin-dashboard/dashboard' },
  ],
}
// navbar
const navItemsByRole = {
  "student": [
    { id: 1, label: 'Dashboard', href: '/dashboard', children: [{ label: 'Overview', href: '/student_dashboard' }, { label: 'Inbox', href: '/inbox' }, { label: 'Fees', href: '/fees' }, { label: 'Settings', href: '/settings' }] },
    { id: 2, label: 'Courses', href: '/courses', children: [{ label: 'Assignments', href: '/assignments' }, { label: 'Grades', href: '/grades' }, { label: 'Calendar', href: '/calendar' }] },
    { id: 3, label: 'Community', href: '/community', },
    { id: 5, label: 'TA', href: '/ta' } //yaha pe children add kar dena and 
  ],
  "faculty": [
    { id: 1, label: 'Dashboard', href: '/dashboard', children: [{ label: 'Profile', href: '/profile' }, { label: 'Settings', href: '/settings' }] },
    { id: 2, label: 'Classes', href: '/classes', children: [{ label: 'Manage Classes', href: '/manage-classes' }, { label: 'Grades', href: '/grades' }, { label: 'Schedule', href: '/schedule' }] },
    { id: 3, label: 'Faculty Forum', href: '/forum', children: [{ label: 'Posts', href: '/posts' }, { label: 'Topics', href: '/topics' }, { label: 'Notifications', href: '/notifications' }] },
  ],
  "academic-admin": [
    { id: 1, label: 'Dashboard', href: '/academic-admin-dashboard/dashboard', children: [{ label: 'Profile', href: '/profile' }, { label: 'Settings', href: '/settings' }] },
    { id: 2, label: 'User Management', href: '/academic-admin-dashboard/user_management', children: [{ label: 'Manage Users', href: '/manage-users' }, { label: 'Permissions', href: '/permissions' }] },
    { id: 3, label: 'Course Management', href: '/academic-admin-dashboard/course_management', children: [{ label: 'Settings', href: '/settings' }, { label: 'Logs', href: '/logs' }] },
    { id: 4, label: 'Feedback', href: '/academic-admin-dashboard/feedback', children: [{ label: 'Settings', href: '/settings' }, { label: 'Logs', href: '/logs' }] },
  ],
}

export default function GlobalLayout({ role = userRole }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState({}) // Manage open/close state of each dropdown

  // Get the menu and nav items based on the role
  const menuItems = menuItemsByRole[role] || []
  const navItems = navItemsByRole[role] || []

  // Toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  // Toggle a specific dropdown
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-2xl font-semibold text-indigo-600">StudySync</span>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          {/* For mobile view: Show menuItems */}
          {/* <ul className="hidden lg:block">
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul> */}
          <ul className="lg:block">
            {menuItems.map((menuItem) => {
              // Find the corresponding nav item based on label matching
              const correspondingNavItem = navItems.find((navItem) => navItem.label === menuItem.key);

              // Only render the menuItem if a corresponding navItem is found
              if (correspondingNavItem) {
                return (
                  <li key={menuItem.id} className="mb-2">
                    <Link
                      to={correspondingNavItem.href || '#'}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      <span className="mr-2">{menuItem.icon}</span>
                      {menuItem.label}
                    </Link>
                  </li>
                );
              }

              // If no corresponding navItem is found, do not render anything
              return null;
            })}
          </ul>


          {/* For medium and large screens: Show menuItems */}
          <ul className="hidden">
            {menuItems.map((item) => (
              <li key={item.id} className="mb-2">
                <Link
                  to="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile view dropdown for nav items */}
          <ul className="lg:hidden px-4 py-2">
            {navItems.map((item) => (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className="flex justify-between w-full px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {dropdownOpen[item.id] && (
                  <ul className="ml-4 mt-2 space-y-2">
                    {item.children.map((child, index) => (
                      <li key={index}>
                        {/* Using Link from React Router for navigation */}
                        <Link to={child.href} className="block px-4 py-2 text-gray-500 hover:bg-indigo-50">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between bg-white px-4">
          <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <nav className="hidden lg:block">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link to={item.href} className="text-gray-600 hover:text-indigo-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-1 text-gray-700">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span>{role === 'student' ? 'Amanda' : role === 'faculty' ? 'Professor Smith' : 'John Doe'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}