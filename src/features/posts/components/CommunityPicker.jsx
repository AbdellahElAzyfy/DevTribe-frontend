import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

function CommunityPicker({ field, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCommunity =
    options.find((community) => community.slug === field.state.value) ??
    options[0];

  useEffect(() => {
    if (!options.length || !selectedCommunity) {
      return;
    }

    if (field.state.value !== selectedCommunity.slug) {
      field.handleChange(selectedCommunity.slug);
    }
  }, [field, options, selectedCommunity]);

  return (
    <div className="relative">
      <button
        id="create-post-community"
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-700/70 bg-slate-950/45 px-4 text-sm text-slate-100 outline-none transition duration-300 hover:border-slate-500/70 focus:border-blue-400/60"
      >
        <span>r/{selectedCommunity?.slug}</span>
        <HiChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/95 shadow-xl shadow-black/35">
          <div className="max-h-56 overflow-y-auto p-1.5">
            {options.map((community) => {
              const isSelected = community.slug === field.state.value;

              return (
                <button
                  key={community.id}
                  type="button"
                  onClick={() => {
                    field.handleChange(community.slug);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition duration-200 ${
                    isSelected
                      ? "bg-slate-800 text-slate-100"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100"
                  }`}
                >
                  <span>r/{community.slug}</span>
                  {isSelected ? (
                    <span className="text-xs text-sky-300">Selected</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CommunityPicker;
