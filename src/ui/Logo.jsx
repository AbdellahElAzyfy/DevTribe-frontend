import { Link } from "react-router-dom";
import { BRAND_NAME } from "../constants/brand";
import brandMark from "../assets/devtribe-watermark.png";

export default function Logo({ to = "/home", showWordmark = true }) {
  return (
    <div className="shrink-0">
      <Link
        to={to}
        aria-label={`${BRAND_NAME} home`}
        className="group flex items-center gap-2 rounded-lg px-1.5 py-1 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <img
          src={brandMark}
          alt={showWordmark ? "" : `${BRAND_NAME} logo`}
          aria-hidden={showWordmark ? "true" : undefined}
          className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105"
        />
        {showWordmark ? (
          <span className="text-xl font-semibold tracking-tight text-gray-100 transition-colors duration-200 group-hover:text-blue-400">
            {BRAND_NAME}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
