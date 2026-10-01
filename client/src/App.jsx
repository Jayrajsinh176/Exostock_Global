import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import VendorsPage from "./pages/VendorsPage";
import VendorSupplyPaymentPage from "./pages/VendorSupplyPaymentPage";
import BillingPage from "./pages/billing/BillingPage";
import PaymentPage from "./pages/billing/PaymentPage";
import ReviewPage from "./pages/billing/ReviewPage";
import SuccessPage from "./pages/billing/SuccessPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProductDetailsPage from "./pages/ProductDetailsPage ";
import BillingHistoryPage from "./pages/billing/BillingHistoryPage";
import AddFranchisePage from "./pages/franchise/AddFranchisePage";
import FranchiseListPage from "./pages/franchise/FranchiseListPage";
import FranchiseDetailsPage from "./pages/franchise/FranchiseDetailsPage";
import EditFranchisePage from "./pages/franchise/EditFranchisePage";
import ChangePassword from "./components/auth/ChangePassword";
import PurchaseHistory from "./pages/PurchaseHistory";
import AddPurchasePage from "./pages/purchases/AddPurchasePage";
import AIAssistant from "./components/AIAssistant";
import StockTransferHistoryPage from "./pages/StockTransferHistoryPage";
import ProductReportsPage from "./pages/reports/ProductReportsPage";
import OrderReportsPage from "./pages/reports/OrderReportsPage";
import StockTransferReportsPage from "./pages/reports/StockTransferReportsPage";
import PrivacyPolicyPage from "./components/landing/PrivacyPolicyPage";
import TermsOfServicePage from "./components/landing/TermsOfServicePage";
import SubscriptionBillingPolicyPage from "./components/landing/SubscriptionBillingPolicyPage";
import CancellationRefundPolicyPage from "./components/landing/CancellationRefundPolicyPage";
import DataRetentionDeletionPolicyPage from "./components/landing/DataRetentionDeletionPolicyPage";
import SecurityBackupPolicyPage from "./components/landing/SecurityBackupPolicyPage";
import AcceptableUsePolicyPage from "./components/landing/AcceptableUsePolicyPage";
import AIAssistantDisclaimerPage from "./components/landing/AIAssistantDisclaimerPage";
import GeneralPolicyUpdatesPage from "./components/landing/GeneralPolicyUpdatesPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/subscription-billing-policy" element={<SubscriptionBillingPolicyPage />} />
          <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicyPage />}/>
          <Route path="/data-retention-deletion-policy" element={<DataRetentionDeletionPolicyPage />}/>
          <Route path="/security-backup-policy" element={<SecurityBackupPolicyPage />}/>
          <Route path="/acceptable-use-policy" element={<AcceptableUsePolicyPage />}/>
          <Route path="/ai-assistant-disclaimer" element={<AIAssistantDisclaimerPage />}/>
          <Route path="/general-policy-updates" element={<GeneralPolicyUpdatesPage />}/>

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:productId"
            element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <VendorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases/add"
            element={
              <ProtectedRoute>
                <AddPurchasePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/purchase-history"
            element={
              <ProtectedRoute>
                <PurchaseHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <SubscriptionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/details"
            element={
              <ProtectedRoute>
                <ProductDetailsPage />{" "}
              </ProtectedRoute>
            }
          />

          {/* Nested Billing/POS routes */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/review"
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing-history"
            element={
              <ProtectedRoute>
                <BillingHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Franchise routes */}

          <Route
            path="/franchises/add"
            element={
              <ProtectedRoute requiredAccess="standard">
                <AddFranchisePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/franchises"
            element={
              <ProtectedRoute requiredAccess="standard">
                <FranchiseListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/franchises/:id/edit"
            element={
              <ProtectedRoute requiredAccess="standard">
                <EditFranchisePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/franchises/:id"
            element={
              <ProtectedRoute requiredAccess="standard">
                <FranchiseDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock-transfers/history"
            element={
              <ProtectedRoute requiredAccess="standard">
                <StockTransferHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/products"
            element={
              <ProtectedRoute requiredAccess="basic">
                <ProductReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/orders"
            element={
              <ProtectedRoute requiredAccess="basic">
                <OrderReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/stock-transfers"
            element={
              <ProtectedRoute requiredAccess="standard">
                <StockTransferReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:userId"
            element={
              <ProtectedRoute>
                <EditUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:vendorId/supply-requests/:requestId/payment"
            element={
              <ProtectedRoute>
                <VendorSupplyPaymentPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
    </>
  );
}

export default App;
