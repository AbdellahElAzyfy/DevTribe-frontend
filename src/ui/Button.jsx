import { Link } from "react-router-dom";

function Button({ children, onClick, to, disabled = false, type }) {
  const base =
    "dash-frame inline-flex h-10 items-center justify-center rounded-lg border-2 border-transparent px-5 text-sm font-medium tracking-tight transition-all duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:px-6";
  const styles = {
    primary:
      base +
      " [--dash-color:rgba(59,130,246,0.64)] bg-slate-900 text-slate-50 shadow-sm shadow-black/45 hover:[--dash-color:rgba(96,165,250,0.8)] hover:bg-slate-800 hover:text-white",
    secondary:
      base +
      " [--dash-color:rgba(100,116,139,0.44)] bg-slate-800 text-slate-200 shadow-sm shadow-black/20 hover:[--dash-color:rgba(148,163,184,0.56)] hover:bg-slate-700 hover:text-slate-100",
  };
  if (to) {
    return (
      <Link to={to} className={styles[type] || styles.primary}>
        {children}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles[type] || styles.primary}
    >
      {children}
    </button>
  );
}

export default Button;
