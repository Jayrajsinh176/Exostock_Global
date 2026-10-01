import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdWorkspacePremium } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { getSubscriptionAlert, AuthService } from "../../api";

const SubscriptionAlert = () => {
  const navigate = useNavigate();

  const loginType = AuthService.getLoginType();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  if (loginType === "franchise") {
    return null;
  }

  useEffect(() => {
    loadAlert();
  }, []);

  const loadAlert = async () => {
    try {
      const data = await getSubscriptionAlert();

      if (data.success) {
        setAlert(data.alert);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !alert) return null;

  const alertStyles = {
    trial: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      button: "bg-blue-600 text-white hover:bg-blue-700",
    },

    warning: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      button: "bg-blue-500 text-white hover:bg-blue-600",
    },

    expired: {
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      button: "bg-red-600 text-white hover:bg-red-700",
    },
  };

  const style =
    alertStyles[alert.type] || alertStyles.trial;

  return (
   <div
  className={`relative overflow-hidden rounded-[22px] mb-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300
      ? "border-l-[5px] border-l-blue-600"
      : alert.type === "warning"
      ? "border-l-[5px] border-l-amber-500"
      : "border-l-[5px] border-l-red-600"
  }`}
>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-7 min-h-[112px]">

        {/* Left */}

        <div className="flex items-center gap-5 flex-1">

<div
  className={`${style.iconBg} w-[60px] h-[60px] rounded-[18px] border border-gray-100 flex items-center justify-center flex-shrink-0`}
>
            <MdWorkspacePremium
              className={style.iconColor}
              size={28}
            />
          </div>

          <div>

         <h2 className="text-gray-900 text-[22px] font-bold leading-tight">
              {alert.title}
            </h2>
          <p className="text-gray-500 text-[15px] mt-1.5 leading-6">
              {alert.message}
            </p>


          </div>

        </div>

        {/* Right */}

    <div className="w-full lg:w-auto">

          <button
            onClick={() => navigate(alert.buttonLink)}
            className={`${style.button} w-full lg:w-auto flex items-center justify-center gap-2 rounded-[18px] px-8 h-[48px] font-semibold text-[16px] transition-all duration-300 hover:shadow-lg`}
          >
            {alert.buttonText}

            <FiArrowRight size={18} />

          </button>

        </div>

      </div>
    </div>
  );
};

export default SubscriptionAlert;