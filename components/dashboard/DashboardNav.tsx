'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/dashboard/home', label: 'Home' },
  { href: '/dashboard/sales', label: 'Sales' },
  { href: '/dashboard/task', label: 'Task' },
  { href: '/dashboard/mail', label: "Client's Mail" },
  { href: '/dashboard/team', label: 'Team' },
];

function getInitials(name: string) {
  if (!name || !name.trim()) return '?';
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

export default function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [avatarName, setAvatarName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.name) setAvatarName(session.user.name);
  }, [session]);

  useEffect(() => {
    const handler = (e: any) => setAvatarName(e.detail.name);
    window.addEventListener('opal:nameUpdated', handler);
    return () => window.removeEventListener('opal:nameUpdated', handler);
  }, []);

  // Don't render nav links during SSR to avoid Dark Reader hydration mismatch
  // The nav shell renders immediately; link styles resolve after mount
  const displayName = mounted ? (avatarName || '') : '';

  return (
    <nav
      suppressHydrationWarning
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        gap: 0,
        flexShrink: 0,
        fontFamily: 'var(--font-primary), var(--font-secondary), system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {/* Logo */}
        <Link href='/dashboard/home' style={{ textDecoration: 'none', marginRight: '32px', flexShrink: 0 }}>
          <span
            suppressHydrationWarning
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-primary), monospace',
              userSelect: 'none',
              textTransform: 'uppercase',
            }}
          >
            OPAL
          </span>
        </Link>

        {/* Nav links — plain divs with suppressHydrationWarning to beat Dark Reader */}
        <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard/home' && pathname.startsWith(link.href));

            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <div
                  suppressHydrationWarning
                  style={{
                    padding: '12px 24px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#000000' : '#ffffff',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                    userSelect: 'none' as const,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-secondary), sans-serif',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  }}
                  onMouseDown={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.97)';
                  }}
                  onMouseUp={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                  }}
                >
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* User avatar + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          <span
            suppressHydrationWarning
            style={{
              fontSize: '16px',
              color: '#ffffff',
              fontWeight: 600,
              fontFamily: 'var(--font-secondary), sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {displayName ? displayName.toUpperCase() : ''}
          </span>
          <div
            suppressHydrationWarning
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-primary), monospace',
              fontSize: '1rem',
              color: '#ffffff',
              letterSpacing: '0.05em',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(14,165,233,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {mounted ? getInitials(avatarName) : ''}
          </div>
        </div>
      </div>
    </nav>
  );
}
