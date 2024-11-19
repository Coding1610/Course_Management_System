import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Report from "../MasterAdmin/Dashboard/Report";
import Settings from "../MasterAdmin/Dashboard/Setting";
import Activity from "../MasterAdmin/Dashboard/Activity";
import Overview from '../MasterAdmin/Dashboard/Overview';
import ManageAdmin from '../MasterAdmin/AdminManagement/ManageAdmin';
import CreateAdmin from '../MasterAdmin/AdminManagement/CreateAdmin';

const MasterAdmin = () => {
  return (
    <div className="App">
      <Routes>
        {/* Default Route */}
        <Route path="*" element={<Overview />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/report" element={<Report />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        
        {/* User Management Routes */}
        <Route path="/user-management/manage-admin" element={<ManageAdmin />} />
        <Route path="/user-management/create-admin" element={<CreateAdmin />} />
      </Routes>
    </div>
  );
};

export default MasterAdmin;
