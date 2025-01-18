"use client";

import React, { ReactElement, cloneElement } from "react";

import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonGroupProps {
    className?: string;
    children: ReactElement<ButtonProps>[];
}

export const ButtonGroup = ({
    className,
    children,
}: ButtonGroupProps) => {
    const totalButtons = children.length;

    return (
        <div className={cn("flex w-full", className)}>
            {children.map((child, index) => {
                const isFirst = index === 0;
                const isLast = index === totalButtons - 1;

                return <React.Fragment key={index}>{cloneElement(child, {

                    className: cn(
                        {
                            "rounded-l-none": !isFirst,
                            "rounded-r-none": !isLast,
                            "border-l-0": !isFirst,
                        },
                        child.props.className
                    ),
                })}
                </React.Fragment>
            })}
        </div>
    );
};