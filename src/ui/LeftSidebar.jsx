import { useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { closeMobileSidebar, toggleDesktopSidebar } from "../store/uiSlice";
import { useCommunitiesQuery } from "../features/communities/useCommunityQueries";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarCommunitiesSection from "./sidebar/SidebarCommunitiesSection";
import SidebarManageSection from "./sidebar/SidebarManageSection";
import SidebarFooter from "./sidebar/SidebarFooter";

function LeftSidebar({ mobileOpen = false, onMobileClose }) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isDesktopSidebarOpen);
  const [isCommunityListOpen, setIsCommunityListOpen] = useState(true);
  const { data: communities = [] } = useCommunitiesQuery();

  const communityItems = useMemo(() => {
    if (communities.length) {
      return communities;
    }

    return [
      {
        id: "fallback-reactjs",
        slug: "reactjs",
        name: "ReactJS",
        isJoined: true,
      },
      {
        id: "fallback-laravel",
        slug: "laravel",
        name: "Laravel",
        isJoined: false,
      },
      {
        id: "fallback-javascript",
        slug: "javascript",
        name: "JavaScript",
        isJoined: true,
      },
    ];
  }, [communities]);

  const joinedCommunities = useMemo(
    () => communityItems.filter((community) => community.isJoined).slice(0, 3),
    [communityItems],
  );

  const handleMobileClose = () => {
    dispatch(closeMobileSidebar());
    if (onMobileClose) onMobileClose();
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3.5 rounded-lg border px-4 py-3 text-base transition duration-200 ${
      isActive
        ? "border-slate-600/60 bg-slate-800/70 font-medium text-slate-100"
        : "border-transparent text-slate-300 hover:border-slate-700/70 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  const sidebarContent = (
    <div className="dash-frame flex min-h-full w-full flex-col rounded-xl border-2 border-transparent [--dash-color:rgba(100,116,139,0.4)] bg-slate-900/35 p-3">
      <SidebarNavigation
        navItemClass={navItemClass}
        onNavigate={handleMobileClose}
      />

      <SidebarCommunitiesSection
        communityItems={communityItems}
        isOpen={isCommunityListOpen}
        onToggle={() => setIsCommunityListOpen((prev) => !prev)}
        onNavigate={handleMobileClose}
      />

      <SidebarManageSection
        joinedCommunities={joinedCommunities}
        onNavigate={handleMobileClose}
      />

      <SidebarFooter />
    </div>
  );

  return (
    <>
      <div className="relative hidden h-full min-h-0 self-stretch md:block">
        <aside
          className={`dash-rail dash-rail-right relative isolate h-full min-h-0 self-stretch overflow-hidden [--dash-color:rgba(100,116,139,0.42)] bg-[#0b1120] text-slate-300 transition-all duration-300 ${
            isOpen ? "w-64" : "w-10"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-52deg, rgba(100, 116, 139, 0.52) 0px, rgba(100, 116, 139, 0.52) 1px, transparent 1px, transparent 9px)",
              }}
            />
          </div>

          <div
            className={`relative z-10 h-full overflow-y-auto transition-all duration-300 ${
              isOpen ? "p-4 opacity-100" : "pointer-events-none p-0 opacity-0"
            }`}
          >
            {sidebarContent}
          </div>
        </aside>

        <button
          type="button"
          onClick={() => dispatch(toggleDesktopSidebar())}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`group absolute top-6 z-20 inline-flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-slate-300 shadow-lg shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
            isOpen ? "left-64" : "left-10 top-10"
          }`}
        >
          <span className="pointer-events-none absolute -right-20 rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300 opacity-0 transition duration-200 group-hover:opacity-100">
            {isOpen ? "Collapse" : "Expand"}
          </span>

          {isOpen ? (
            <HiChevronLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          ) : (
            <HiChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={handleMobileClose}
          className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`dash-rail dash-rail-right absolute left-0 top-16 bottom-0 w-72 max-w-[85vw] overflow-hidden [--dash-color:rgba(100,116,139,0.42)] bg-[#0b1120] text-slate-300 shadow-2xl shadow-black/50 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-52deg, rgba(100, 116, 139, 0.52) 0px, rgba(100, 116, 139, 0.52) 1px, transparent 1px, transparent 9px)",
              }}
            />
          </div>

          <div className="relative z-10 h-full overflow-y-auto p-4">
            {sidebarContent}
          </div>
        </aside>
      </div>
    </>
  );
}

export default LeftSidebar;
