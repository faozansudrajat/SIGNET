import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotPublisherModal({ isOpen, onClose }: NotPublisherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[425px] p-0 overflow-hidden border-0 bg-transparent shadow-none"
      )}>
        <div className={cn(
          "w-full h-full flex flex-col items-center justify-center p-8 relative rounded-3xl",
          "bg-white/[0.55] dark:bg-white/[0.05]",
          "border border-gray-300 dark:border-white/10",
          "backdrop-blur-md shadow-lg"
        )}>
          <DialogHeader className="w-full flex flex-col items-center">
            {/* Icon Container matching HowItWorks */}
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-gray-300 dark:border-white/10",
              "bg-white/40 dark:bg-white/10",
              "shadow-none"
            )}>
              <ShieldAlert className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>

            <DialogTitle className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">
              Access Restricted
            </DialogTitle>

            <DialogDescription className="text-base text-gray-700 dark:text-white/80 text-center leading-relaxed px-2">
              Your wallet address is not registered as an authorized publisher. You need to register on-chain to access the dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full py-6">
            <div className="rounded-xl bg-gray-600/5 dark:bg-white/5 p-4 text-sm text-gray-600 dark:text-white/60 text-center border border-gray-200 dark:border-white/5">
              Self-registration is now available. You can whitelist your own wallet by paying the gas fee.
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 bg-transparent text-gray-900 dark:text-white"
            >
              Close
            </Button>
            <Button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20"
              onClick={() => window.location.href = "/register-publisher"}
            >
              <ShieldAlert className="w-4 h-4" />
              Register Now
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
