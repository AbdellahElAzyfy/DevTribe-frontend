import Logo from "./Logo";
import Search from "./Search";
import HeaderActions from "./HeaderActions";
import { HiBars3 } from "react-icons/hi2";

function Header({ onMobileMenuToggle }) {
  return (
    <header className="dash-bottom h-16 border-b border-transparent [--dash-color:rgba(100,116,139,0.42)] bg-[#0b1120] px-3 sm:px-6">
      <div className="relative mx-auto flex h-full w-full max-w-screen-2xl items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
          className="dash-frame inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-transparent [--dash-color:rgba(100,116,139,0.48)] bg-slate-800 text-slate-300 transition duration-200 hover:[--dash-color:rgba(148,163,184,0.62)] hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 md:hidden"
        >
          <HiBars3 className="h-5 w-5" />
        </button>

        <Logo />

        <Search />

        <HeaderActions />
      </div>
    </header>
  );
}

export default Header;
