"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BouncingDotsProps {
  dots?: number;
  className?: string;
}

export function BouncingDots({ dots = 3, className }: BouncingDotsProps) {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {Array.from({ length: dots }).map((_, index) => (
        <motion.div
          key={index}
          className={cn("w-2 h-2 bg-current rounded-full", className)}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
