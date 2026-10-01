import BrandMark from "../common/BrandMark";

const SignupBranding = () => {
  return (
    <div className="flex flex-col items-center mb-6 text-center">
      <BrandMark />
      <p className="mt-4 text-[14px] font-semibold text-[#0d5b96]">
        Create your account and manage stock, billing, and reports in one place
      </p>
    </div>
  );
};

export default SignupBranding;
