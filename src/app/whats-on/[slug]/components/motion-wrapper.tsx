'use client';

import React from "react";
import { motion } from "framer-motion";

interface MotionDivProps {
    children: React.ReactNode;
    className?: string;
    initial?: any;
    animate?: any;
    whileInView?: any;
    transition?: any;
    viewport?: any;
    style?: React.CSSProperties;
}

export const MotionDiv: React.FC<MotionDivProps> = ({
    children,
    className,
    initial,
    animate,
    whileInView,
    transition,
    viewport,
    style
}) => {
    return (
        <motion.div
            className={className}
            initial={initial}
            animate={animate}
            whileInView={whileInView}
            transition={transition}
            viewport={viewport}
            style={style}
        >
            {children}
        </motion.div>
    );
};

interface MotionH2Props {
    children: React.ReactNode;
    className?: string;
    initial?: any;
    whileInView?: any;
    transition?: any;
    viewport?: any;
}

export const MotionH2: React.FC<MotionH2Props> = ({
    children,
    className,
    initial,
    whileInView,
    transition,
    viewport
}) => {
    return (
        <motion.h2
            className={className}
            initial={initial}
            whileInView={whileInView}
            transition={transition}
            viewport={viewport}
        >
            {children}
        </motion.h2>
    );
};
