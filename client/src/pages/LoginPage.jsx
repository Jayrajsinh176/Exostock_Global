import LoginBranding from '../components/auth/LoginBranding';
import LoginForm from '../components/auth/LoginForm';
import AuthFooter from '../components/auth/AuthFooter';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 60% 30%, rgba(0,0,0,0.03) 0%, transparent 70%)',
      }}
    >
      {/* Branding: Logo + identity */}
      <LoginBranding />

      {/* Auth form card */}
      <LoginForm />

      {/* Footer links
      <AuthFooter /> */}
    </div>
  );
};

export default LoginPage;
