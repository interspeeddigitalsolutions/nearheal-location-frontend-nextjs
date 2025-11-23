"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { JoinMenu } from "./JoinMenu";
import { MegaMenu } from "./MegaMenu";
import { useAuth } from "@/hooks/useAuth";
import { authServerInfo } from "@/lib/auth";

// Mock auth server info - replace with your actual configuration
// const authServerInfo = {
//   url: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001",
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "your-client-id",
//   redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL || "http://localhost:3000",
// };

interface HeaderWithMegaMenuProps {
  logoImageOnly?: boolean;
  compact?: boolean;
}

export const HeaderWithMegaMenu = ({
  logoImageOnly = false,
  compact = false,
}: HeaderWithMegaMenuProps) => {
  const { isLoggedIn, handleLogin, handleRegister, handleLogout, user } =
    useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`bg-white border-b w-full flex items-center ${compact ? "h-[38px]" : "h-[64px]"
          } fixed top-0 left-0 right-0 z-[100]`}
      >
        <div
          className={`container mx-auto px-3 md:px-4 ${compact ? "py-0 sm:py-1" : "py-2 sm:py-3"
            }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/near_heal_logo.jpeg"
                alt="Nearheal Logo"
                width={compact ? 32 : 48}
                height={compact ? 32 : 48}
                className="rounded-lg"
              />
              {!logoImageOnly && (
                <span className="font-bold text-xl text-primary">Nearheal</span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* <MegaMenu /> */}
              {/* <JoinMenu /> */}
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_JOB_FRONTEND_URL}`}
                target="_blank"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Jobs
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Search and User */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  {!isMobile && (
                    <div>
                      <Button className="mr-1" onClick={handleLogin}>
                        Sign In
                      </Button>
                      <Button variant="outline" onClick={handleRegister}>
                        Sign Up
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full overflow-hidden"
                    >
                      {user?.avatarUrl ? (
                        <Image
                          src={user.avatarUrl || "/placeholder.svg"}
                          alt="User avatar"
                          width={32}
                          height={32}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {getInitials(
                            user?.name ?? `${user?.firstName} ${user?.lastName}`
                          )}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="mr-2 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/favorites">
                      <DropdownMenuItem className="cursor-pointer">
                        <Heart className="mr-2 w-4" />
                        <span>Favorite</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div
          className="md:hidden py-4 border-t fade-in bg-white fixed w-full left-0 right-0 h-full overflow-auto pb-32"
          style={{
            position: "fixed",
            top: compact ? "38px" : "64px",
            zIndex: 9999,
          }}
        >
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex flex-col space-y-4">
              <nav className="flex flex-col space-y-4">
                {/* <MegaMenu />
                <JoinMenu /> */}
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_JOB_FRONTEND_URL}`}
                  target="_blank"
                  className="text-gray-700 hover:text-primary transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  href="/about-us"
                  className="text-gray-700 hover:text-primary transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-primary transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                {!isLoggedIn && (
                  <>
                    <Link
                      href={`${authServerInfo.url}/login?token=${authServerInfo.clientId}&redirect_url=${authServerInfo.redirectUrl}`}
                      className="text-gray-700 hover:text-primary transition-colors px-4"
                    >
                      Sign In
                    </Link>

                    <Link
                      href={`${authServerInfo.url}/register?token=${authServerInfo.clientId}&redirect_url=${authServerInfo.redirectUrl}`}
                      className="text-gray-700 hover:text-primary transition-colors px-4"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
