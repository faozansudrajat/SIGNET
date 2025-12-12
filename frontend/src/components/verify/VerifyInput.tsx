import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { UploadCloud, Link as LinkIcon, X, Image, Video, FileText, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type VerifyInputProps = {
  file: File | null;
  url: string;
  isVerifying: boolean;
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
};

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  return FileText;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export function VerifyInput({ file, url, isVerifying, onFileChange, onUrlChange }: VerifyInputProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
        onUrlChange("");
      }
    },
    [onFileChange, onUrlChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isVerifying,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      "video/*": [".mp4", ".mov", ".avi"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "audio/*": [".mp3", ".wav"],
    },
  });

  const FileIcon = file ? getFileIcon(file) : UploadCloud;

  return (
    <GlassCard className="p-8 space-y-8 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
      {/* File Upload */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden",
          isDragActive
            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.02]"
            : "border-slate-300/80 dark:border-white/[0.08] hover:border-blue-500/60 dark:hover:border-blue-400/50 hover:bg-white/80 dark:hover:bg-blue-900/5 bg-white/70 dark:bg-black/20",
          isVerifying && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-transparent group-hover:to-blue-500/5 transition-all duration-500" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
              >
                <FileIcon className="w-10 h-10 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                key="upload-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                  isDragActive
                    ? "bg-blue-500/30 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                    : "bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110"
                )}
              >
                <UploadCloud className="w-10 h-10 text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-xl font-medium text-foreground">{file.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileChange(null);
                    }}
                    className="p-1.5 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded-full text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {file.type || "Unknown type"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-foreground">
                  {isDragActive ? "Drop it here!" : "Drag & drop file here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, MP4, PDF, DOCX, MP3, WAV (Max 50MB)
                </p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </>
            )}
          </div>
        </div>

        {/* Bottom glow bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-white/[0.1] dark:border-white/[0.08]"></div>
        <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm uppercase tracking-wider font-medium">
          or paste URL
        </span>
        <div className="flex-grow border-t border-white/[0.1] dark:border-white/[0.08]"></div>
      </div>

      {/* URL Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <LinkIcon className="w-5 h-5" />
        </div>
        <Input
          placeholder="https://example.com/image.jpg or https://twitter.com/..."
          value={url}
          onChange={(e) => {
            onUrlChange(e.target.value);
            if (e.target.value) onFileChange(null);
          }}
          disabled={isVerifying}
          className="pl-12 h-14 rounded-xl bg-white/[0.05] dark:bg-black/40 border-white/[0.1] dark:border-white/[0.08] text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500/50 text-lg"
        />
        {url && (
          <button
            onClick={() => onUrlChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.1] dark:hover:bg-white/[0.1] rounded-full text-muted-foreground hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </GlassCard>
  );
}

