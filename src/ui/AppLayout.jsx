import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { closeMobileSidebar, openMobileSidebar } from "../store/uiSlice";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import BottomNav from "./BottomNav";
import SocketProvider from "../realtime/SocketProvider";

function AppLayout() {
  const dispatch = useDispatch();
  const isMobileSidebarOpen = useSelector(
    (state) => state.ui.isMobileSidebarOpen,
  );

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <SocketProvider>
      <div className="relative flex h-screen flex-col bg-[#0b1120]">
        <Header onMobileMenuToggle={() => dispatch(openMobileSidebar())} />
        <div className="pointer-events-none fixed inset-x-0 top-16 bottom-0 z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(112deg,rgba(148,163,184,0.16)_0px,rgba(148,163,184,0.16)_1px,transparent_1px,transparent_84px)] sm:bg-[repeating-linear-gradient(112deg,rgba(148,163,184,0.16)_0px,rgba(148,163,184,0.16)_1px,transparent_1px,transparent_56px)]" />

          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(180deg,rgba(148,163,184,0.18)_0px,rgba(148,163,184,0.18)_1px,transparent_1px,transparent_108px)] sm:bg-[repeating-linear-gradient(180deg,rgba(148,163,184,0.18)_0px,rgba(148,163,184,0.18)_1px,transparent_1px,transparent_72px)]" />

          <div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

          <div className="absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl motion-safe:animate-[pulse_14s_cubic-bezier(0.4,0,0.6,1)_infinite] sm:h-80 sm:w-80" />

          <div className="absolute top-1/3 -left-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl motion-safe:animate-[pulse_18s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:1200ms] sm:-left-12 sm:h-64 sm:w-64" />

          <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl motion-safe:animate-[pulse_20s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:2200ms] sm:right-16 sm:h-72 sm:w-72" />

          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-slate-400/10 via-blue-500/5 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 items-stretch overflow-hidden">
          <LeftSidebar
            mobileOpen={isMobileSidebarOpen}
            onMobileClose={() => dispatch(closeMobileSidebar())}
          />

          <main className="relative isolate min-w-0 flex-1 overflow-y-auto bg-transparent p-4 pb-28 sm:p-6 sm:pb-28 md:pb-6">
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>

          <RightSidebar />
        </div>

        <BottomNav />
      </div>
    </SocketProvider>
  );
}

export default AppLayout;
