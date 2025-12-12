import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./sections";

interface MobileTableOfContentsProps {
  onItemClick?: () => void;
}

export function MobileTableOfContents({
  onItemClick,
}: MobileTableOfContentsProps) {
  const [location] = useLocation();

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-6 px-3">
          Table of Contents
        </h3>
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive =
            location === section.href || location.startsWith(section.href);

          return (
            <Link key={section.id} href={section.href}>
              <motion.button
                whileHover={{ x: 4 }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
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
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                  )}
                />
                <span>{section.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
