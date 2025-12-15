import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import {
  UploadCloud,
  File,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "wagmi";
import { registerContent } from "@/lib/api";

export default function RegisterContent() {
  const [file, setFile] = useState<File | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    ip_id: string;
    phash: string;
    tx_hash: string;
    license_status: string;
    ipfs_metadata: string;
  } | null>(null);
  const [step, setStep] = useState("");

  useAccount();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "video/*": [".mp4", ".mov", ".avi"],
    },
  });

  const handleRegister = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setStep("Uploading file and generating hash...");

    try {
      const response = await registerContent(file, ownerName, description);

      if (response.status === "SUCCESS") {
        setResult({
          ip_id: response.ip_id,
          phash: response.phash,
          tx_hash: response.tx_hash,
          license_status: response.license_status,
          ipfs_metadata: response.ipfs_metadata || "",
        });
        // Reset form on success
        setFile(null);
        setOwnerName("");
        setDescription("");
      } else {
        setError(response.msg || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      console.error(err);
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Registration Successful!
          </h2>
          <p className="text-muted-foreground">
            Your content has been successfully hashed and registered on Story
            Protocol Story Protocol network with IPFS metadata.
          </p>
          <div className="bg-black/5 dark:bg-black/30 p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
            <div className="font-mono text-xs text-slate-700 dark:text-gray-400 break-all">
              <span className="text-gray-600 dark:text-gray-500">IP ID:</span>{" "}
              {result.ip_id}
            </div>
            <div className="font-mono text-xs text-slate-700 dark:text-gray-400 break-all">
              <span className="text-gray-600 dark:text-gray-500">TX Hash:</span>{" "}
              <a
                href={`https://aeneid.storyscan.xyz/tx/${result.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {result.tx_hash}
              </a>
            </div>
            <div className="font-mono text-xs text-slate-700 dark:text-gray-400 break-all">
              <span className="text-gray-600 dark:text-gray-500">pHash:</span>{" "}
              {result.phash}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">
              <span className="text-gray-600 dark:text-gray-500">License:</span>{" "}
              {result.license_status}
            </div>
            {result.ipfs_metadata && (
              <div className="font-mono text-xs text-slate-700 dark:text-gray-400 break-all">
                <span className="text-gray-600 dark:text-gray-500">IPFS:</span>{" "}
                <a
                  href={result.ipfs_metadata.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {result.ipfs_metadata}
                </a>
              </div>
            )}
          </div>
          <GlowButton
            onClick={() => {
              window.location.reload();
            }}
          >
            Register Another
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Registration Failed!
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-3">
            <GlowButton
              onClick={() => {
                window.location.reload(); // Simple reset
              }}
              className="flex-1"
            >
              Try Again
            </GlowButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-2">
        <h2 className="text-xl font-bold text-foreground">Register Content</h2>
        <p className="text-muted-foreground text-sm">
          Upload assets to generate a perceptual hash and anchor it to the blockchain.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-3">
          {/* File Uploader */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300
              ${isDragActive
                ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/5 bg-black/[0.01] dark:bg-white/2"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive
                    ? "Drop file here"
                    : "Drag & drop file or click to browse"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPG, PNG, MP4, MOV, AVI (Max 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Owner Name Form */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Content Information
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-muted-foreground">
                  Owner Name (Optional)
                </Label>
                <Input
                  placeholder="Leave empty to use backend wallet address"
                  className="bg-black/[0.03] dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground placeholder:text-muted-foreground"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Description</Label>
                <textarea
                  placeholder="Enter a description for your content (optional)"
                  className="w-full h-12 px-2 py-1 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-foreground placeholder:text-muted-foreground resize-none text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <GlowButton
                className="w-full py-2 text-sm"
                onClick={handleRegister}
                disabled={!file || loading}
                loading={loading}
              >
                {loading
                  ? step || "Processing..."
                  : "Register Content on Story Protocol"}
              </GlowButton>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-3">
          {/* Preview & Hash */}
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <GlassCard className="border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <File className="w-5 h-5 text-blue-400" />
                    Selected File
                  </h3>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 dark:bg-black/40 border border-black/10 dark:border-white/10">
                    <div className="w-8 h-8 rounded bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                      {file.name.split(".").pop()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  </div>
                </GlassCard>

                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-black/[0.03] dark:bg-white/5 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p>
                    Your content will be registered on Story Protocol network.
                    The backend will handle the blockchain transaction, IPFS
                    upload, and license attachment.
                  </p>
                </div>
              </motion.div>
            ) : (
              <GlassCard className="h-[150px] flex flex-col items-center justify-center text-center text-gray-500 border-dashed">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <File className="w-5 h-5 opacity-30" />
                </div>
                <p className="text-sm">Select a file to preview</p>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div >
    </>
  );
}
