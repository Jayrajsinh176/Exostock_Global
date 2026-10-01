import SignupBranding from '../components/auth/SignupBranding';
import SignupForm from '../components/auth/SignupForm';
import SystemStatusBar from '../components/auth/SystemStatusBar';

const SignupPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 40% 60%, rgba(0,0,0,0.025) 0%, transparent 70%)',
      }}
    >
      {/* Branding */}
      <SignupBranding />

      {/* Signup form card */}
      <SignupForm />

      {/* System status bar (CLOUD ACTIVE · SECURE NODE · VERSION) */}
      {/* <div className="w-full max-w-[500px] mt-6 px-2">
        <SystemStatusBar />
      </div> */}
    </div>
  );
};

export default SignupPage;
