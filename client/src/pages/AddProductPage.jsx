import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AddProductForm } from '../components/dashboard/AddProductComponents';

const AddProductPage = () => {
  const navigate = useNavigate();

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
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] text-[#6C757D] mb-6">
            <span>Products</span>
            <MdChevronRight className="text-[16px]" />
            <span className="font-semibold text-[#212529]">New Product</span>
          </div>

          {/* Page Header with Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529] mb-2">Add New Product</h1>
              <p className="text-[14px] text-[#6C757D]">
                Create a new entry in your architectural furniture catalog.
              </p>
            </div>
          </div>

          {/* Form */}
          <AddProductForm onSubmitSuccess={() => navigate('/products')} />
        </main>
      </div>
    </div>
  );
};

export default AddProductPage;
