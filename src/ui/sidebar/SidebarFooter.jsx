import { BRAND_NAME } from "../../constants/brand";

function SidebarFooter() {
  return (
    <div className="mt-4 border-t border-slate-700/50 px-3 pt-3">
      <p className="flex items-center gap-2 text-[10px] tracking-[0.12em] text-slate-500">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-600/80 bg-slate-800 text-[8px] font-semibold text-slate-300">
          d
        </span>
        <span>
          {BRAND_NAME} inc. {new Date().getFullYear()} All rights reserved.
        </span>
      </p>
    </div>
  );
}

export default SidebarFooter;
