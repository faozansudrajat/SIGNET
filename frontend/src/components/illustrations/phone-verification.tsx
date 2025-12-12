import { motion } from "framer-motion";


export const PhoneVerification = () => {
  return (
    <svg viewBox="0 0 300 500" className="w-full h-full">
      <defs>
        <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <filter id="phoneGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Phone body */}
      <motion.rect
        x="50"
        y="50"
        width="200"
        height="400"
        rx="30"
        fill="url(#phoneGradient)"
        stroke="#3b82f6"
        strokeWidth="3"
        filter="url(#phoneGlow)"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Screen */}
      <rect
        x="65"
        y="80"
        width="170"
        height="330"
        rx="10"
        fill="#000"
        opacity="0.8"
      />

      {/* Notch */}
      <rect
        x="120"
        y="65"
        width="60"
        height="10"
        rx="5"
        fill="#1f2937"
      />

      {/* Content on screen - Image placeholder */}
      <motion.rect
        x="80"
        y="100"
        width="140"
        height="100"
        rx="8"
        fill="#1f2937"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Fake/Real indicator animation */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Verification badge - alternating */}
        <motion.rect
          x="85"
          y="220"
          width="130"
          height="60"
          rx="10"
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
          {/* Shield check icon representation */}
          <circle cx="110" cy="250" r="12" fill="#10b981" />
          <path
            d="M107 250 L109 252 L113 248"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>

        <text x="130" y="255" fill="#10b981" fontSize="14" fontWeight="bold">
          VERIFIED
        </text>
      </motion.g>

      {/* Scanning animation lines */}
      <motion.line
        x1="80"
        x2="220"
        stroke="#3b82f6"
        strokeWidth="2"
        opacity="0.6"
        initial={{ y1: 100, y2: 100 }}
        animate={{
          y1: [100, 200, 100],
          y2: [100, 200, 100],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />


      {/* Details text */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <rect x="85" y="300" width="130" height="3" rx="1.5" fill="#3b82f6" opacity="0.3" />
        <rect x="85" y="310" width="100" height="3" rx="1.5" fill="#3b82f6" opacity="0.3" />
        <rect x="85" y="320" width="120" height="3" rx="1.5" fill="#3b82f6" opacity="0.3" />

        {/* Blockchain hash representation */}
        <text x="90" y="350" fill="#6b7280" fontSize="8" fontFamily="monospace">
          Hash: 0x4a3f...
        </text>
        <text x="90" y="365" fill="#6b7280" fontSize="8" fontFamily="monospace">
          Block: 1,234,567
        </text>
      </motion.g>

      {/* Floating particles around phone */}
      {[...Array(6)].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + Math.random() * 200}
          cy={50 + Math.random() * 400}
          r="3"
          fill="#3b82f6"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </svg>
  );
};

