import { useLocation } from "wouter";
import { useEffect } from "react";
import { APIDocsLayout } from "@/components/api-docs/APIDocsLayout";
import Introduction from "./api-docs/introduction";
import Register from "./api-docs/register";
import Verify from "./api-docs/verify";
import Contents from "./api-docs/contents";
import Notes from "./api-docs/notes";

export default function APIDocs() {
  const [location] = useLocation();

  // Redirect /docs to /docs/introduction
  useEffect(() => {
    if (location === "/docs") {
      window.history.replaceState(null, "", "/docs/introduction");
    }
  }, [location]);

  // Render the appropriate page component based on the route
  const renderContent = () => {
    switch (location) {
      case "/docs":
      case "/docs/introduction":
        return <Introduction />;
      case "/docs/register":
        return <Register />;
      case "/docs/verify":
        return <Verify />;
      case "/docs/contents":
        return <Contents />;
      case "/docs/notes":
        return <Notes />;
      default:
        return <Introduction />;
    }
  };

  return <APIDocsLayout>{renderContent()}</APIDocsLayout>;
}
