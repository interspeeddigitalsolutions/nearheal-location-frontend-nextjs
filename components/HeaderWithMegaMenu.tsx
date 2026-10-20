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
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { authServerInfo } from "@/lib/auth";

interface HeaderWithMegaMenuProps {
  logoImageOnly?: boolean;
  compact?: boolean;
}

export const HeaderWithMegaMenu = ({
  logoImageOnly = false,
  compact = false,
}: HeaderWithMegaMenuProps) => {
  const { isLoggedIn, handleLogin, handleLogout, user } =
    useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const memberUrl = isLoggedIn
    ? "/profile"
    : `${authServerInfo.url}/register?token=${authServerInfo.clientId}&redirect_url=${authServerInfo.redirectUrl}`;
  const providerUrl = process.env.NEXT_PUBLIC_NEARHEAL_LOCATION_ADMIN_URL || "/contact";
  const jobUrl = (process.env.NEXT_PUBLIC_JOB_FRONTEND_URL || "/jobs").replace(/\/$/, "");
  const recruiterUrl = process.env.NEXT_PUBLIC_JOB_ADMIN_DASHBOARD_URL || jobUrl;
  const jobGroups = [
    { label: "For recruiters", links: [{ label: "Start hiring", href: recruiterUrl }] },
    { label: "For candidates", links: [
      { label: "Find jobs", href: jobUrl },
      { label: "Search jobs", href: `${jobUrl}/jobs` },
      { label: "Featured jobs", href: `${jobUrl}#featured-jobs` },
    ] },
  ];

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
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 whitespace-nowrap text-sm lg:text-base">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
              <Link href={memberUrl} className="text-gray-700 hover:text-primary transition-colors">Become a member</Link>
              <Link href={providerUrl} className="text-gray-700 hover:text-primary transition-colors">Become a provider</Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
                    Jobs <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-[101] w-56">
                  {jobGroups.map((group, index) => (
                    <div key={group.label}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                      {group.links.map((link) => (
                        <DropdownMenuItem asChild key={link.label}>
                          <a href={link.href} className="cursor-pointer">{link.label}</a>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <DropdownMenuContent align="end" className="z-[101] w-56">
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
                  aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-navigation"
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
          id="mobile-navigation"
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
                <Link href="/" className="text-gray-700 hover:text-primary px-4" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href={memberUrl} className="text-gray-700 hover:text-primary px-4" onClick={() => setIsMenuOpen(false)}>Become a member</Link>
                <Link href={providerUrl} className="text-gray-700 hover:text-primary px-4" onClick={() => setIsMenuOpen(false)}>Become a provider</Link>
                <details className="group px-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-gray-700 hover:text-primary [&::-webkit-details-marker]:hidden">
                    Jobs <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="mt-3 space-y-4 rounded-lg border bg-gray-50 p-4">
                    {jobGroups.map((group) => (
                      <div key={group.label} className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                        {group.links.map((link) => (
                          <a key={link.label} href={link.href} className="block py-1 text-gray-700 hover:text-primary" onClick={() => setIsMenuOpen(false)}>{link.label}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
                {!isLoggedIn && (
                  <button className="text-left text-gray-700 hover:text-primary px-4" onClick={() => { setIsMenuOpen(false); handleLogin(); }}>Sign In</button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
