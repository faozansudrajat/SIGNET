import { useEffect } from "react";
import { useLocation } from "wouter";
import { usePublisher } from "@/hooks/usePublisher";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePublisher?: boolean;
  requireOwner?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requirePublisher = false, 
  requireOwner = false 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isConnected, isPublisher, isOwner, isLoading, address } = usePublisher();

  useEffect(() => {
    if (isLoading) return;

    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ProtectedRoute] Debug:', {
        address,
        isConnected,
        isPublisher,
        isOwner,
        requirePublisher,
        requireOwner,
        isLoading,
      });
    }

    if (!isConnected) {
      setLocation("/");
      return;
    }

    if (requireOwner) {
      if (!isOwner) {
        console.warn('[ProtectedRoute] Access denied: Not owner', { address, requireOwner });
        setLocation("/");
        return;
      }
    }

    if (requirePublisher) {
      if (!isPublisher) {
        console.warn('[ProtectedRoute] Access denied: Not publisher', { address, requirePublisher });
        setLocation("/");
        return;
      }
    }
  }, [isConnected, isPublisher, isOwner, isLoading, requirePublisher, requireOwner, setLocation, address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return null;
  }

  if (requireOwner && !isOwner) {
    return null;
  }

  if (requirePublisher && !isPublisher) {
    return null;
  }

  return <>{children}</>;
}

