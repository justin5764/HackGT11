import React from "react";

const sizes = {
    textxs: "text-[26px] font-medium md:text-[24px] sm:text-[22px]",
};

export type HeadingProps = Partial<{
    className: string;
    as: any;
    size: keyof typeof sizes;
}> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
    children,
    className = "",
    size = "textxs",
    as,
    ...restProps
}) => {
    const Component = as || "h6";

    return(
        <Component className={`text-blue_gray-800 font-roboto ${className} ${sizes[size]}`} {...restProps}>
            {children}
        </Component>
    );
};

export { Heading };
