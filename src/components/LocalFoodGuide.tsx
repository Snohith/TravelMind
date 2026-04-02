"use client";

import { Delicacy } from "@/data/mock-itinerary";
import { motion } from "framer-motion";
import { Info, Utensils } from "lucide-react";
import Image from "next/image";

interface FoodGuideProps {
  delicacies: Delicacy[];
}

export default function LocalFoodGuide({ delicacies }: FoodGuideProps) {
  if (!delicacies || delicacies.length === 0) return null;

  return (
    <div className="mt-12 mb-8 px-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Utensils className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Must-Try Local Flavors</h3>
          <p className="text-sm text-zinc-500 font-medium">Authentic delicacies you can&apos;t miss</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {delicacies.map((food, index) => (
          <motion.div
            key={food.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-amber-500/30 transition-all duration-500"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                {food.name}
              </h4>
              <p className="text-xs text-zinc-300 line-clamp-2 font-medium leading-relaxed">
                {food.description}
              </p>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <Info className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <p className="text-[11px] text-amber-200/60 font-medium leading-relaxed italic text-center">
          &quot;Food is the ingredient that binds us together. Pro-tip: Ask locals for the oldest joints to get the most authentic taste!&quot;
        </p>
      </div>
    </div>
  );
}
