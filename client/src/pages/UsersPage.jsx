import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { UsersHeader, UsersTable } from '../components/dashboard/UsersComponents';

const UsersPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
const navigate = useNavigate();
const isStaff = AuthService.getUser()?.role === "staff";
const isFranchise = AuthService.isFranchise();

useEffect(() => {
  if (isStaff || isFranchise) {
    navigate("/dashboard", { replace: true });
  }
}, [isStaff, isFranchise, navigate]);

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[300px]">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Users Header */}
          <UsersHeader 
            onAddClick={() => setShowAddForm(true)} 
            loading={false}
          />

          {/* Users Table */}
          <UsersTable showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
