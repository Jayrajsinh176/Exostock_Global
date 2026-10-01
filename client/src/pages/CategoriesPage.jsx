import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { CategoriesHeader, CategoriesGrid } from "../components/dashboard/CategoriesComponents";
import { AuthService } from "../api";
import { useState } from "react";

const CategoriesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const isFranchise = AuthService.getLoginType() === "franchise";

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
          {/* Categories Header */}
     <CategoriesHeader
  onAddClick={() => setShowAddForm(true)}
  isFranchise={isFranchise}
/>

          {/* Categories Grid */}
          <CategoriesGrid showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
