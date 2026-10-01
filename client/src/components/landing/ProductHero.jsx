import productVideo from "../../images/product1.mp4";

export default function ProductHero() {
  return (
    <section className="bg-[#0d5b96] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Content */}

        <div className="text-center lg:text-left">
          {/* Badge */}

          <span className="inline-block rounded-full bg-[#c4dbf5] px-4 py-2 text-[11px] font-bold tracking-widest text-[#0d5b96] transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:px-6 sm:text-xs">
            ● INTRODUCING EXOSTOCK
          </span>

          {/* Heading */}

          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:mt-8 sm:text-5xl lg:text-5xl">
            Stock less. Sell more.
            <span className="block text-[#c4dbf5]">Scale faster.</span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-blue-100 sm:mt-8 sm:text-lg sm:leading-8 lg:mx-0 lg:text-xl">
            ExoStock gives growing businesses real-time inventory control, and multi-location visibility all in one platform built to scale with you.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button className="rounded-xl bg-white px-6 py-4 text-base font-bold text-[#0d5b96] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#c4dbf5] sm:px-8 sm:text-lg">
              🎯 Get Free Demo
            </button>
          </div>

          {/* Stats */}

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-14">
            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-white hover:bg-white/20">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                100%
              </h2>

              <p className="mt-2 text-sm font-semibold text-blue-100 sm:text-base">
                Secured Data
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-white hover:bg-white/20">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Any 
              </h2>

              <p className="mt-2 text-sm font-semibold text-blue-100 sm:text-base">
                Question? Answers Within Seconds
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-white hover:bg-white/20">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                24/7
              </h2>

              <p className="mt-2 text-sm font-semibold text-blue-100 sm:text-base">
                Support
              </p>
            </div>
          </div>
        </div>

        {/* Right Video */}

        <div className="w-full">
          <div className="rounded-3xl border-4 border-[#c4dbf5] bg-[#083d67] p-3 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] sm:p-5">
            <span className="mb-4 inline-block rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white sm:px-5 sm:text-sm">
              🔵 ExoStock Live Demo
            </span>

            <video
              src={productVideo}
              autoPlay
              muted
              loop
              controls
              playsInline
              className="w-full rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
