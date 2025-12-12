import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./sections";

interface TableOfContentsProps {
  onItemClick?: () => void;
}

export function TableOfContents({ onItemClick }: TableOfContentsProps) {
  const [location] = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-4 top-28 bottom-4 w-[280px] flex flex-col z-30 overflow-hidden rounded-3xl",
        // Glassmorphism bright style to match verify small screens
        "border border-white/[0.18] dark:border-white/[0.08] shadow-[0_18px_45px_rgba(15,23,42,0.18)]",
        "bg-white/80 dark:bg-[rgba(20,20,20,0.6)]"
      )}
      style={{
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >

      {/* Navigation items - No scroll, items fit in available space */}
      <div className="flex-1 overflow-hidden pt-6 px-6 pb-6">
        <div className="space-y-1 h-full flex flex-col">
          <h3 className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-4 px-3 flex-shrink-0">
            Table of Contents
          </h3>
          <div className="flex-1 space-y-1 overflow-hidden">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive =
                location === section.href || location.startsWith(section.href);

              return (
                <Link key={section.id} href={section.href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200",
                      "flex items-center gap-3 group",
                      "border-l-2",
                      isActive
                        ? "text-gray-900 dark:text-white bg-white/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 border-transparent hover:border-blue-500/50"
                    )}
                    onClick={onItemClick}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors flex-shrink-0",
                        isActive
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                      )}
                    />
                    <span className="truncate">{section.label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
