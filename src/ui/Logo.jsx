import { Link } from "react-router-dom";
import { BRAND_NAME } from "../constants/brand";

export default function Logo() {
  return (
    <div className="shrink-0">
      <Link
        to="/home"
        className="rounded-lg px-2 py-1 text-xl font-semibold tracking-tight text-gray-100 transition duration-200 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        {BRAND_NAME}
      </Link>
    </div>
  );
}
