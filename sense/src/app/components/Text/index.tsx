import React from "react";

const sizes = {
  text4xl: "text-[62px] font-normal not-italic md:text-[48px]",
  text5xl: "text-[67px] font-normal not-italic md:text-[48px]",
  text6xl: "text-[70px] font-normal not-italic md:text-[48px]", // Updated key
  text7xl: "text-[72px] font-normal not-italic md:text-[48px]", // Updated key from text7x1 to text7xl
  text8xl: "text-[72px] font-normal not-italic md:text-[48px]", // Updated key from text8x1 to text8xl
  texts: "text-[34px] font-normal not-italic md:text-[32px] sm:text-[30px]",
  textmd: "text-[35px] font-normal not-italic md:text-[33px] sm:text-[31px]",
  textlg: "text-[39px] font-normal not-italic md:text-[37px] sm:text-[35px]",
  textxl: "text-[40px] font-normal not-italic md:text-[38px] sm:text-[36px]",
  text2xl: "text-[50px] font-normal not-italic md:text-[46px] sm:text-[40px]",
  text3xl: "text-[60px] font-normal not-italic md:text-[52px] sm:text-[46px]", // Fixed the px typo here
};

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "text6xl", // Fixed default value to text6xl
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-black-900 font-inter ${className} ${sizes[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };