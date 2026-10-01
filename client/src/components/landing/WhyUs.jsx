import {
  MapPin,
  BadgeDollarSign,
  ShieldCheck,
  Headphones,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Bot } from "lucide-react";
const features = [
  {
    icon: <MapPin size={34} />,
    title: "Support Team",
    desc: "No overseas call centres. Our team is based in Bharuch — same timezone, same language, same problems you face.",
  },
  {
  icon: <Bot size={34} />,
  title: "Instant Answers",
  desc: "Get answers to any inventory or stock question within seconds using AI-powered assistance.",
},
  {
    icon: <ShieldCheck size={34} />,
    title: "Your Data, Always",
    desc: "Secure cloud storage with complete data ownership. Export everything, anytime. No lock-in, ever.",
  },
  {
    icon: <Headphones size={34} />,
    title: "Onboarding Included",
    desc: "Full staff training at no extra cost. Your team starts using ExoStock from day one — no consultants needed.",
  },
];

export default function WhyUs() {
  return (
    <section
      id="why"
      className="bg-gradient-to-b from-white via-[#f8fbff] to-[#eef6fd] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#0d5b96]/10 px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#0d5b96]">
            BUILT FOR BUSINESSES
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-[#0d5b96] sm:text-5xl">
            Built Here.
            <br />
            Built for You.
          </h2>

          <p className="mt-6 text-lg leading-8 text-[#0d5b96]">
            ExoStock is designed from the ground up for Indian businesses —
            GST-ready, WhatsApp-friendly, and backed by a team that speaks your
            language and answers your calls.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-[#dce8f4] bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#0d5b96] hover:shadow-2xl"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d5b96]/10 text-[#0d5b96] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#0d5b96] group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-[#0d5b96]">{item.title}</h3>

              <p className="mt-4 text-[15px] leading-7 text-[#0d5b96]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}

        <div className="relative mt-20 overflow-hidden rounded-[36px] bg-[#0d5b96] px-8 py-14 text-center shadow-2xl lg:px-16 lg:py-20">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#0d5b96]/20 blur-[120px]" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
              Ready to take control
              <br />
              of your inventory?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Join hundreds of businesses that have replaced messy spreadsheets
              with ExoStock. Start your free trial today — no credit card
              needed.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
              <a
                href="https://wa.me/918511624907?text=Hi%20ExoStock,%20I'm%20interested%20in%20a%20demo."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-[#0d5b96] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c4dbf5]"
              >
                <MessageCircle size={20} />
                WhatsApp Demo
              </a>

              <a
                href="tel:+918511624907"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#0d5b96]"
              >
                <Phone size={20} />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
