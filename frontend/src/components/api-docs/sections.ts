import { Hash, ShieldCheck, Globe, Server, AlertCircle } from "lucide-react";

export const SECTIONS = [
  { id: "introduction", label: "Introduction", icon: Hash, href: "/docs/introduction" },
  { id: "register", label: "Register Content", icon: Server, href: "/docs/register" },
  { id: "verify", label: "Verify Content", icon: ShieldCheck, href: "/docs/verify" },
  { id: "contents", label: "Get All Contents", icon: Globe, href: "/docs/contents" },
  { id: "notes", label: "Additional Notes", icon: AlertCircle, href: "/docs/notes" },
];

