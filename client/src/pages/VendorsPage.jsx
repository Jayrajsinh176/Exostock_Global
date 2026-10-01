import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { VendorsList } from '../components/dashboard/VendorsComponents';

const VendorsPage = () => {
  const [vendorsRefreshKey, setVendorsRefreshKey] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleVendorsChanged = () => {
    setVendorsRefreshKey((currentKey) => currentKey + 1);
  };

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
          {/* Vendors List */}
          <VendorsList 
            refreshKey={vendorsRefreshKey}
            selectedVendor={selectedVendor}
            onVendorSelect={setSelectedVendor}
            onVendorsChanged={handleVendorsChanged}
          />
        </main>
      </div>
    </div>
  );
};

export default VendorsPage;
