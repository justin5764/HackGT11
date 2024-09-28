import React from "react";

const shapes = {
    square: "rounded-[0px]",
    round: "rounded-[30px]",
} as const;
const variants = {
    fill: {
        white_A700: "bg-white-a700 text-deep_purple-900",
        indigo_900: "bg-indigo-900 text-white-a700",
        deep_purple_50: "bg-deep_purple-50 text-blue_gray-800",
        cyan_200: "bg-cyan-200",
    },
} as const;
const sizes = {
    lg: "h-[116px] px-8 text-[40px]",
    xl: "h-[136px] px-[34px] text-[50px]",
    md: "h-[70px] px-[34px] text-[39px]",
    xs: "h-[40px] px-2.5 text-[26px]",
    sm: "h-[62px] px-6 text-[17px]",
} as const;

type ButtonProps = Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    "onClick"
> &
    Partial<{
        className: string;
        leftIcon: React.ReactNode;
        rightIcon: React.ReactNode;
        onClick: () => void;
        shape: keyof typeof shapes;
        variant: keyof typeof variants | null;
        size: keyof typeof sizes;
        color: string;
    }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    children,
    className = "",
    leftIcon,
    rightIcon,
    shape,
    variant = "fill",
    size = "sm",
    color = "cyan_200",
    ...restProps
}) => {
    return (
        <button
            className = {`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color as keyof (typeof variants)[typeof variant]]}`}
            {...restProps}
        >
            {!!leftIcon && leftIcon}
            {children}
            {!!rightIcon && rightIcon}
        </button>
    );
};

export { Button };
