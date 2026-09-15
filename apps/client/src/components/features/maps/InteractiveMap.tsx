"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const departments = [
    { id: "granada", name: "Granada", cx: 180, cy: 320, r: 15 },
    { id: "leon", name: "León", cx: 120, cy: 250, r: 15 },
    { id: "ometepe", name: "Ometepe", cx: 220, cy: 350, r: 12 },
    { id: "rivas", name: "Rivas", cx: 200, cy: 380, r: 15 },
    { id: "corn-island", name: "Corn Island", cx: 450, cy: 200, r: 10 },
];

export default function InteractiveMap() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="relative w-full h-96 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 flex items-center justify-center overflow-hidden">
            <h3 className="absolute top-4 left-4 text-white font-serif text-xl">Explora Nicaragua</h3>

            <svg viewBox="0 0 500 400" className="w-full h-full">
                {/* Placeholder for Nicaragua Map Outline - Simplified */}
                <path
                    d="M50,150 Q100,100 150,120 T250,150 T350,100 T450,150 V300 Q400,350 300,320 T150,350 T50,300 Z"
                    fill="rgba(255,255,255,0.1)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                />

                {departments.map((dept) => (
                    <motion.g
                        key={dept.id}
                        onHoverStart={() => setHovered(dept.id)}
                        onHoverEnd={() => setHovered(null)}
                        whileHover={{ scale: 1.2 }}
                        className="cursor-pointer"
                    >
                        <circle
                            cx={dept.cx}
                            cy={dept.cy}
                            r={dept.r}
                            fill={hovered === dept.id ? "#e29578" : "#006d77"}
                            stroke="#fff"
                            strokeWidth="2"
                        />
                        {hovered === dept.id && (
                            <text
                                x={dept.cx}
                                y={dept.cy - 25}
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="bold"
                                className="pointer-events-none"
                            >
                                {dept.name}
                            </text>
                        )}
                    </motion.g>
                ))}
            </svg>
        </div>
    );
}
