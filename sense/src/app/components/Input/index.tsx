"use client";
import React from "react";

const shapes = {
    square: "rounded-[0px]",
} as const;

const variants = {
    fill: {
        blue_gray_100: "bg-blue_gray-100",
    },
} as const;

const sizes = {
    xs: "h-[80px] px-3",
    sm: "h-[90px] px-3",
} as const;

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> &
    Partial<{
        label: string;
        prefix: React.ReactNode;
        suffix: React.ReactNode;
        shape: keyof typeof shapes;
        variant: keyof typeof variants | null;
        size: keyof typeof sizes;
        color: string;
    }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = "",
            name = "",
            placeholder = "",
            type = "text",
            label = "",
            prefix,
            suffix,
            onChange,
            shape,
            variant = "fill",
            size = "xs",
            color = "blue_gray_100",
            ...restProps
        },
        ref,
    ) => {
        return(
            <label
            className = {`${className} flex items-center justify-center self-stretch md:mr-0 cursor-text bg-blue_gray-100 ${shape && shapes[shape]} ${variant && (variants[variant]?.[color as keyof (typeof variants)[typeof variant]] || variants[variant])} $size && sizes[size]}`}
            >
                {!!label && label}
                {!!prefix && prefix}
                <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
                {!!suffix && suffix}
            </label>
        );
    },
);

export{ Input };