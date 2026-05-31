import { BRAND_NAME } from "../../constants/brand";
import brandMark from "../../assets/devtribe-mark.png";

function SidebarFooter() {
  return (
    <div className="mt-4 border-t border-slate-700/50 px-3 pt-3">
      <p className="flex items-center gap-2 text-[10px] tracking-[0.12em] text-slate-500">
        <img
          src={brandMark}
          alt=""
          aria-hidden="true"
          className="h-4 w-4 shrink-0 object-contain"
        />
        <span>
          {BRAND_NAME} inc. {new Date().getFullYear()} All rights reserved.
        </span>
      </p>
    </div>
  );
}

export default SidebarFooter;
