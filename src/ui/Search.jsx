import { useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { closeMobileSearch, toggleMobileSearch } from "../store/uiSlice";

export default function Search() {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector((state) => state.ui.isMobileSearchOpen);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen) return;

    inputRef.current?.focus();
  }, [isMobileOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        dispatch(closeMobileSearch());
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(closeMobileSearch());
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return (
    <div className="mx-1 min-w-0 md:mx-6 md:flex-1 md:max-w-2xl">
      <div className="hidden md:block">
        <input
          type="text"
          placeholder="Search posts or communities..."
          className="dash-frame h-11 w-full min-w-0 rounded-full border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800/95 px-4 text-sm text-slate-200 placeholder:text-slate-500 shadow-inner shadow-black/20 transition-all duration-300 ease-out focus:[--dash-color:rgba(96,165,250,0.74)] focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
        />
      </div>

      <button
        type="button"
        aria-label="Search"
        onClick={() => dispatch(toggleMobileSearch())}
        className="dash-frame inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800 text-slate-300 transition duration-200 hover:[--dash-color:rgba(148,163,184,0.62)] hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 md:hidden"
      >
        {isMobileOpen ? (
          <HiXMark className="h-5 w-5" />
        ) : (
          <HiMagnifyingGlass className="h-5 w-5" />
        )}
      </button>

      {isMobileOpen ? (
        <div className="absolute inset-x-0 top-full z-40 mt-2 px-3 sm:px-6 md:hidden">
          <div className="dash-frame flex items-center gap-2 rounded-xl border-2 border-transparent [--dash-color:rgba(100,116,139,0.52)] bg-slate-900/95 p-2 shadow-xl shadow-black/40">
            <HiMagnifyingGlass className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search posts or communities..."
              className="h-9 w-full bg-transparent px-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => dispatch(closeMobileSearch())}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition duration-200 hover:bg-slate-800 hover:text-slate-200"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
