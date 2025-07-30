
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrencyForAnimation = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};

export const AnimatedCounter = ({ value }: { value: number }) => {
    const formattedValue = formatCurrencyForAnimation(value);
    
    return (
        <div className="flex items-center text-2xl font-bold overflow-hidden">
            {formattedValue.split('').map((char, index) => {
                if (char.match(/[0-9]/)) {
                    return (
                        <div key={index} className="relative tabular-nums">
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={`${char}-${index}`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    );
                }
                return <span key={index}>{char}</span>;
            })}
        </div>
    );
};
