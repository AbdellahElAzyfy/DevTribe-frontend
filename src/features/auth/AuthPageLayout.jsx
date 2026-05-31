import { Link } from "react-router-dom";
import AuthVisual from "./AuthVisual";
import { BRAND_NAME } from "../../constants/brand";
import brandMark from "../../assets/devtribe-mark.png";
import brandWatermark from "../../assets/devtribe-watermark.png";

export default function AuthPageLayout({ title, subtitle, children }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0b1120] px-4 py-10 text-slate-200">
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[repeating-linear-gradient(112deg,rgba(148,163,184,0.16)_0px,rgba(148,163,184,0.16)_1px,transparent_1px,transparent_72px)]" />

      <img
        src={brandWatermark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 w-120 max-w-[65%] select-none opacity-[0.05]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <AuthVisual />

          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-700/70 bg-slate-900/70 p-6 shadow-sm shadow-black/35">
            <Link
              to="/login"
              aria-label={`${BRAND_NAME} login`}
              className="mb-5 inline-flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 lg:hidden"
            >
              <img
                src={brandMark}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 object-contain"
              />
              <span className="text-lg font-semibold tracking-tight text-slate-100">
                {BRAND_NAME}
              </span>
            </Link>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
