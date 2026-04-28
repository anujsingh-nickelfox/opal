"use client";

import { useState } from "react";
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

// ─── Default data — Unsplash portraits (reliable, no auth needed) ─────────────

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Jordan Ellis",
    role: "Director of Photography",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=face",
    social: { twitter: "#", linkedin: "#", behance: "#" },
  },
  {
    id: "2",
    name: "Mia Fontaine",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "3",
    name: "Luca Moretti",
    role: "Lead Front-End",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "4",
    name: "Sophie Kwan",
    role: "Product Owner",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=face",
    social: { linkedin: "#" },
  },
  {
    id: "5",
    name: "Remy Nakamura",
    role: "CTO · Product Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: "6",
    name: "Amara Diallo",
    role: "Make-up Artiste",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face",
    social: { instagram: "#" },
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({
  members = DEFAULT_MEMBERS,
}: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: "80px", width: "100%" }}>
      {/* ── Left: photo grid ── */}
      <div style={{ display: "flex", gap: "24px", flexShrink: 0 }}>
        {/* Column 1 — no offset */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              size="large"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 — indented down */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "120px" }}>
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              size="xlarge"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 — half offset */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "60px" }}>
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              size="large"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Right: member name list ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", flex: 1, maxWidth: "400px", paddingTop: "40px" }}>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────

function PhotoCard({
  member,
  size,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  size: "large" | "xlarge";
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  
  const dimensions = size === "xlarge" 
    ? { width: 280, height: 320 }
    : { width: 260, height: 300 };

  return (
    <div
      style={{ 
        width: dimensions.width,
        height: dimensions.height,
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        opacity: isDimmed ? 0.3 : 1,
        transform: isActive ? "scale(1.03)" : "scale(1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={member.image}
        alt={member.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: isActive
            ? "grayscale(0) brightness(1.1)"
            : "grayscale(1) brightness(0.5)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
    </div>
  );
}

// ─── MemberRow ────────────────────────────────────────────────────────────────

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  const hasSocial =
    member.social?.twitter ??
    member.social?.linkedin ??
    member.social?.instagram ??
    member.social?.behance;

  return (
    <div
      style={{
        cursor: "pointer",
        opacity: isDimmed ? 0.3 : 1,
        transition: "opacity 0.3s ease"
      }}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name row + social icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "#ffffff" : "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-secondary), sans-serif",
            transition: "all 0.3s ease",
            letterSpacing: "0.03em"
          }}
        >
          {member.name}
        </span>

        {/* Social icons — slide in on hover */}
        {hasSocial && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateX(0)" : "translateX(-12px)",
              transition: "all 0.25s ease",
              pointerEvents: isActive ? "auto" : "none"
            }}
          >
            {member.social?.twitter && (
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "rgba(255,255,255,0.7)" }}>
                <FaTwitter size={16} />
              </a>
            )}
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "rgba(255,255,255,0.7)" }}>
                <FaLinkedinIn size={16} />
              </a>
            )}
            {member.social?.instagram && (
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "rgba(255,255,255,0.7)" }}>
                <FaInstagram size={16} />
              </a>
            )}
            {member.social?.behance && (
              <a href={member.social.behance} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: "rgba(255,255,255,0.7)" }}>
                <FaBehance size={16} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role label */}
      <p style={{ 
        marginTop: "8px", 
        fontSize: "14px", 
        fontWeight: 600, 
        textTransform: "uppercase", 
        letterSpacing: "0.2em", 
        color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
        fontFamily: "var(--font-secondary), sans-serif",
        transition: "all 0.3s ease"
      }}>
        {member.role}
      </p>
    </div>
  );
}
