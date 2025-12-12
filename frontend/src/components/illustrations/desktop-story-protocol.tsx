import { motion } from "framer-motion";

export const DesktopStoryProtocol = () => {
  return (
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <defs>
        <linearGradient id="desktopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <filter id="desktopGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Monitor Base */}
      <motion.rect
        x="200"
        y="320"
        width="100"
        height="10"
        rx="5"
        fill="#374151"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.rect
        x="220"
        y="330"
        width="60"
        height="70"
        rx="5"
        fill="url(#desktopGradient)"
        stroke="#3b82f6"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />

      {/* Monitor Frame */}
      <motion.rect
        x="50"
        y="50"
        width="400"
        height="280"
        rx="15"
        fill="url(#desktopGradient)"
        stroke="#3b82f6"
        strokeWidth="3"
        filter="url(#desktopGlow)"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Screen */}
      <rect
        x="70"
        y="80"
        width="360"
        height="230"
        rx="8"
        fill="url(#screenGradient)"
        opacity="0.9"
      />

      {/* Screen Content - Story Protocol Flow */}
      {/* Step 1: Upload & Hash Panel */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <rect
          x="85"
          y="95"
          width="160"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#3b82f6"
          strokeWidth="2"
          opacity="0.8"
        />
        <text x="95" y="115" fill="#60a5fa" fontSize="12" fontWeight="bold">
          Step 1: Upload & Hash
        </text>
        <motion.rect
          x="95"
          y="125"
          width="60"
          height="40"
          rx="4"
          fill="#3b82f6"
          fillOpacity="0.2"
          animate={{
            fillOpacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <text x="125" y="145" fill="#60a5fa" fontSize="10" textAnchor="middle">
          pHash
        </text>
        <text x="125" y="158" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">
          0x4a3f...
        </text>
      </motion.g>

      {/* Step 2: NFT Mint Panel */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <rect
          x="255"
          y="95"
          width="160"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.8"
        />
        <text x="265" y="115" fill="#a78bfa" fontSize="12" fontWeight="bold">
          Step 2: Mint NFT
        </text>
        <motion.g
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <rect
            x="280"
            y="125"
            width="50"
            height="50"
            rx="4"
            fill="#8b5cf6"
            fillOpacity="0.3"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <text x="305" y="150" fill="#a78bfa" fontSize="10" textAnchor="middle">
            NFT
          </text>
          <text x="305" y="162" fill="#a78bfa" fontSize="8" textAnchor="middle">
            #1234
          </text>
        </motion.g>
      </motion.g>

      {/* Step 3: IP Asset Registration Panel */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <rect
          x="85"
          y="200"
          width="160"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0.8"
        />
        <text x="95" y="220" fill="#34d399" fontSize="12" fontWeight="bold">
          Step 3: IP Asset
        </text>
        <motion.rect
          x="100"
          y="230"
          width="130"
          height="50"
          rx="6"
          fill="#10b981"
          fillOpacity="0.2"
          stroke="#10b981"
          strokeWidth="2"
          animate={{
            fillOpacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.g
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <circle cx="120" cy="250" r="8" fill="#10b981" />
          <path
            d="M117 250 L119 252 L123 248"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>
        <text x="135" y="255" fill="#34d399" fontSize="11" fontWeight="bold">
          IP ID
        </text>
        <text x="100" y="270" fill="#6b7280" fontSize="8" fontFamily="monospace">
          0x7a8b9c...
        </text>
      </motion.g>

      {/* Step 4: License Attachment Panel */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <rect
          x="255"
          y="200"
          width="160"
          height="90"
          rx="8"
          fill="#1f2937"
          stroke="#f59e0b"
          strokeWidth="2"
          opacity="0.8"
        />
        <text x="265" y="220" fill="#fbbf24" fontSize="12" fontWeight="bold">
          Step 4: License
        </text>
        <motion.rect
          x="270"
          y="230"
          width="130"
          height="50"
          rx="6"
          fill="#f59e0b"
          fillOpacity="0.2"
          stroke="#f59e0b"
          strokeWidth="2"
          animate={{
            fillOpacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <text x="280" y="250" fill="#fbbf24" fontSize="10" fontWeight="bold">
          Non-Commercial
        </text>
        <text x="280" y="265" fill="#6b7280" fontSize="8">
          AI Training Blocked
        </text>
        <motion.circle
          cx="360"
          cy="250"
          r="6"
          fill="#f59e0b"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.g>



      {/* Floating particles around monitor */}
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + Math.random() * 400}
          cy={50 + Math.random() * 350}
          r="2.5"
          fill="#3b82f6"
          animate={{
            y: [-15, 15, -15],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}

      {/* Scanning animation line */}
      <motion.line
        x1="85"
        x2="415"
        stroke="#3b82f6"
        strokeWidth="1.5"
        opacity="0.4"
        strokeDasharray="4 4"
        initial={{ y: 95 }}
        animate={{
          y: [95, 290, 95],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </svg>
  );
};

