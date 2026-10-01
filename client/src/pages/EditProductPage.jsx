import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { MdChevronRight } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { AddProductForm } from '../components/dashboard/AddProductComponents';
import { useState, useEffect } from 'react';
import { getProductById } from '../api';

const EditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(productId);
        if (response && response.product) {
          setProduct(response.product);
          setError('');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmitSuccess = () => {
    navigate('/products');
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
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] text-[#6C757D] mb-6">
            <span>Products</span>
            <MdChevronRight className="text-[16px]" />
            <span className="font-semibold text-[#212529]">Edit Product</span>
          </div>

          {/* Page Header with Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#212529] mb-2">Edit Product</h1>
              <p className="text-[14px] text-[#6C757D]">
                Update product details and inventory information.
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded-lg p-4 mb-6 text-[#721C24]">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-8 text-center text-[#6C757D]">
              Loading product information...
            </div>
          )}

          {/* Form */}
          {!loading && product && (
            <AddProductForm product={product} onSubmitSuccess={handleSubmitSuccess} />
          )}

          {!loading && !product && !error && (
            <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-md p-8 text-center text-[#6C757D]">
              Product not found
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProductPage;
