"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Filter, Users, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions for component props
interface ActivityStat {
  label: string;
  value: number;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
}

interface MarketingDashboardProps {
  title?: string;
  teamActivities: {
    totalHours: number;
    stats: ActivityStat[];
  };
  team: {
    memberCount: number;
    members: TeamMember[];
  };
  cta: {
    text: string;
    buttonText: string;
    onButtonClick: () => void;
  };
  onFilterClick?: () => void;
  className?: string;
}

// Sub-component for animating numbers
const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10);

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

// Main Component
export const MarketingDashboard = React.forwardRef<
  HTMLDivElement,
  MarketingDashboardProps
>(
  (
    {
      title = "Marketing Activities",
      teamActivities,
      team,
      cta,
      onFilterClick,
      className,
    },
    ref
  ) => {
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full p-6 bg-[#0a0a0a] text-white rounded-2xl border border-white/10",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <h2
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-primary), monospace",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFilterClick}
            aria-label="Filter activities"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Team Activities Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="h-full p-4 overflow-hidden rounded-xl bg-[#111111] border-white/10">
              <CardContent className="p-2">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-medium text-white/60"
                    style={{
                      fontFamily: "var(--font-secondary), sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontSize: "13px",
                    }}
                  >
                    Team Activities
                  </p>
                  <Clock className="w-5 h-5 text-white/40" />
                </div>
                <div className="mb-4">
                  <span
                    className="text-4xl font-bold text-white"
                    style={{ fontFamily: "var(--font-primary), monospace" }}
                  >
                    <AnimatedNumber value={teamActivities.totalHours} />
                  </span>
                  <span
                    className="ml-1 text-white/50"
                    style={{ fontFamily: "var(--font-secondary), sans-serif" }}
                  >
                    hours
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 mb-2 overflow-hidden rounded-full bg-white/10 flex">
                  {teamActivities.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className={cn("h-full", stat.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-white/50">
                  {teamActivities.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", stat.color)}></span>
                      <span style={{ fontFamily: "var(--font-secondary), sans-serif" }}>
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Members Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="h-full p-4 overflow-hidden rounded-xl bg-[#1a1a1a] border-white/10">
              <CardContent className="p-2">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-medium text-white/80"
                    style={{
                      fontFamily: "var(--font-secondary), sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontSize: "13px",
                    }}
                  >
                    Team
                  </p>
                  <Users className="w-5 h-5 text-white/60" />
                </div>
                <div className="mb-6">
                  <span
                    className="text-4xl font-bold text-white"
                    style={{ fontFamily: "var(--font-primary), monospace" }}
                  >
                    <AnimatedNumber value={team.memberCount} />
                  </span>
                  <span
                    className="ml-1 text-white/60"
                    style={{ fontFamily: "var(--font-secondary), sans-serif" }}
                  >
                    members
                  </span>
                </div>
                {/* Avatar Stack */}
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10, y: -2 }}
                    >
                      <Avatar className="border-2 border-[#0a0a0a] h-10 w-10">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/10">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <p
                className="text-sm font-medium text-white/60"
                style={{ fontFamily: "var(--font-secondary), sans-serif" }}
              >
                {cta.text}
              </p>
            </div>
            <Button
              onClick={cta.onButtonClick}
              className="shrink-0 bg-white text-black hover:bg-white/90"
              style={{ fontFamily: "var(--font-secondary), sans-serif" }}
            >
              {cta.buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

MarketingDashboard.displayName = "MarketingDashboard";
