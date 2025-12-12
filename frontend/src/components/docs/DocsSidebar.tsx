import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Key,
  Code,
  Gauge,
  Terminal,
  AlertCircle,
  Hash,
} from "lucide-react";
import {
  Files,
  FileItem,
  FolderItem,
  FolderTrigger,
  FolderPanel,
} from "@/components/animate-ui/components/base/files";

type Section = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subsections?: string[];
};

const SECTIONS: Section[] = [
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "authentication", label: "Authentication", icon: Key },
  {
    id: "endpoints",
    label: "Endpoints",
    icon: Code,
    subsections: ["verify", "register", "publisher", "content"],
  },
  { id: "rate-limits", label: "Rate Limits", icon: Gauge },
  { id: "sdk-examples", label: "SDK Examples", icon: Terminal },
  { id: "error-codes", label: "Error Codes", icon: AlertCircle },
];

type DocsSidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function DocsSidebar({
  activeSection,
  onSectionChange,
  isMobileOpen,
  onMobileClose,
}: DocsSidebarProps) {
  const [isSticky, setIsSticky] = useState(false);
  // State to manage open folders in the accordion


  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const scrollToSection = (sectionId: string) => {
    onSectionChange(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    if (onMobileClose) onMobileClose();
  };

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed lg:sticky top-20 lg:top-20 h-[calc(100vh-80px)] w-[280px] flex flex-col z-40 overflow-y-auto custom-scrollbar",
        "bg-black/90 lg:bg-black/20 backdrop-blur-xl border-r border-white/10",
        isSticky && "lg:bg-black/30",
        !isMobileOpen && "hidden lg:flex"
      )}
    >
      <div className="p-4 flex-1">
        <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 px-2">
          Documentation
        </h3>

        {/* @ts-ignore - Files component props might not be fully typed for accordion primitives in this specific setup */}
        <Files
          className="p-0"
        >
          {SECTIONS.map((section) => {
            const isFolder = !!section.subsections;
            const isActive = activeSection === section.id;
            const hasActiveChild = section.subsections?.some(
              (sub) => activeSection === `endpoint-${sub}`
            );

            if (isFolder) {
              return (
                <FolderItem key={section.id} value={section.id}>
                  <FolderTrigger
                    className={cn(
                      "cursor-pointer transition-colors duration-200 rounded-md",
                      (isActive || hasActiveChild) ? "text-blue-400" : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => {
                      scrollToSection(section.id);
                    }}
                  >
                    <span className="font-medium">{section.label}</span>
                  </FolderTrigger>
                  <FolderPanel>
                    {section.subsections?.map((sub) => {
                      const subId = `endpoint-${sub}`;
                      const isSubActive = activeSection === subId;
                      return (
                        <FileItem
                          key={sub}
                          icon={Hash}
                          className={cn(
                            "cursor-pointer transition-colors duration-200",
                            isSubActive ? "text-blue-400 font-medium" : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => scrollToSection(subId)}
                        >
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </FileItem>
                      );
                    })}
                  </FolderPanel>
                </FolderItem>
              );
            }

            return (
              <FileItem
                key={section.id}
                icon={section.icon}
                className={cn(
                  "cursor-pointer transition-colors duration-200 mb-1",
                  isActive ? "text-blue-400 font-medium bg-blue-500/10 rounded-md" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </FileItem>
            );
          })}
        </Files>
      </div>
    </motion.aside>
  );
}
