'use client';

import { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

function getInitials(name: string) {
  if (!name || !name.trim()) return '?';
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

interface UsernameSetupModalProps {
  isOpen: boolean;
  onSuccess: (newName: string) => void;
  onSkip: () => void;
}

export function UsernameSetupModal({ isOpen, onSuccess, onSkip }: UsernameSetupModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const session = await getSession();
      const res = await fetch('/api/user/update-name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session?.user?.id || '',
          'x-user-email': session?.user?.email || '',
        },
        body: JSON.stringify({ displayName: trimmed }),
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess(data.name);
      } else {
        setError(data.message || 'Failed to update name');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !inputValue.trim() || loading;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div
        style={{
          background: '#080b13',
          border: '1px solid rgba(14,165,233,0.18)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          boxShadow: '0 0 0 1px rgba(14,165,233,0.12), 0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(14,165,233,0.08)',
          animation: 'modalIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 32px'
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #0284c7, #0ea5e9)',
          borderRadius: '18px 18px 0 0'
        }} />

        {/* Avatar Preview */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-primary), monospace',
          fontSize: '1.4rem',
          color: '#ffffff',
          letterSpacing: '0.05em',
          boxShadow: '0 0 0 4px rgba(14,165,233,0.15), 0 0 20px rgba(14,165,233,0.2)',
          marginBottom: '24px'
        }}>
          {getInitials(inputValue)}
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-primary), monospace',
          fontSize: '1.35rem',
          color: '#ffffff',
          letterSpacing: '0.03em',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          What should we call you?
        </h2>
        
        {/* Subtext */}
        <p style={{
          fontFamily: 'var(--font-secondary), sans-serif',
          fontSize: '0.82rem',
          color: 'rgba(148,163,184,0.5)',
          margin: '0 0 24px 0',
          textAlign: 'center'
        }}>
          Your name appears on your dashboard and avatar.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              maxLength={40}
              placeholder="Enter your display name"
              style={{
                width: '100%',
                background: 'rgba(14,165,233,0.04)',
                border: '1px solid rgba(14,165,233,0.12)',
                borderRadius: '8px',
                padding: '0.76rem 1rem',
                color: '#ffffff',
                fontFamily: 'var(--font-secondary), sans-serif',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(14,165,233,0.45)';
                e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.07)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(14,165,233,0.12)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {error && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-secondary), sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}
            <div style={{
              position: 'absolute',
              right: '4px',
              bottom: '-20px',
              fontFamily: 'var(--font-primary), monospace',
              fontSize: '0.68rem',
              color: 'rgba(148,163,184,0.32)'
            }}>
              {inputValue.length}/40
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            style={{
              width: '100%',
              background: isSubmitDisabled ? 'rgba(14,165,233,0.3)' : 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              borderRadius: '8px',
              padding: '0.85rem',
              color: '#ffffff',
              fontFamily: 'var(--font-primary), monospace',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              border: 'none',
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              opacity: isSubmitDisabled ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitDisabled) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,233,0.38)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitDisabled) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite', marginRight: '8px', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff"></path>
                </svg>
                SAVING...
              </>
            ) : (
              'Set my name →'
            )}
          </button>
        </form>

        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-secondary), sans-serif',
            fontSize: '0.78rem',
            color: 'rgba(148,163,184,0.35)',
            marginTop: '16px',
            cursor: 'pointer',
            padding: '4px 8px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(148,163,184,0.65)';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(148,163,184,0.35)';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
