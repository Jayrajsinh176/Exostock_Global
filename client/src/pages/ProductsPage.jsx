import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { ProductsHeader, SummaryCards, ProductsTable } from '../components/dashboard/ProductsComponents';

const ProductsPage = () => {
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const handleProductsChanged = () => {
    setStatsRefreshKey((currentKey) => currentKey + 1);
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
          {/* Products Header */}
          <ProductsHeader />

          {/* Summary Cards */}
          <SummaryCards refreshKey={statsRefreshKey} />

          {/* Products Table */}
          <ProductsTable onProductsChanged={handleProductsChanged} />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
