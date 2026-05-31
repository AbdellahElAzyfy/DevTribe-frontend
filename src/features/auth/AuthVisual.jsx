import brandLogo from "../../assets/devtribe-logo.png";

export default function AuthVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden h-130 w-full max-w-135 lg:block"
    >
      <div className="auth-orb auth-orb-a" />
      <div className="auth-orb auth-orb-b" />
      <div className="auth-orb auth-orb-c" />

      <div className="auth-node-core auth-pulse-node auth-delay-1" />

      <div className="auth-node auth-node-a auth-float-node auth-delay-0" />
      <div className="auth-node auth-node-b auth-float-node auth-delay-2" />
      <div className="auth-node auth-node-c auth-float-node auth-delay-1" />
      <div className="auth-node auth-node-d auth-float-node auth-delay-3" />
      <div className="auth-node auth-node-e auth-float-node auth-delay-4" />
      <div className="auth-node auth-node-f auth-float-node auth-delay-2" />

      <div className="auth-link auth-link-a" />
      <div className="auth-link auth-link-b" />
      <div className="auth-link auth-link-c" />
      <div className="auth-link auth-link-d" />
      <div className="auth-link auth-link-e" />

      <div className="auth-float-slow auth-delay-1 absolute inset-0 z-30 flex items-center justify-center">
        <img
          src={brandLogo}
          alt=""
          className="w-80 max-w-[80%] object-contain drop-shadow-[0_20px_55px_rgba(2,6,23,0.7)]"
        />
      </div>
    </div>
  );
}
