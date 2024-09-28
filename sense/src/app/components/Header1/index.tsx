import { Text, Img } from "./..";
import React from "react";

interface Props{
    className?: string;
}

export default function Header1({ ...props }: Props) {
    return(
        <header {...props} className={`${props.className} flex self-stretch items-center`}>
            <div className="flex h-[150px] w-full items-end bg-[url(/images/img_group_255.png)] bg-cover bg-no-repeat px-1.5 py[38px] md:h-auto sm:py-5">
                <div className="mx-auto mt-3 flex w-full max-w-[1418px] items-start justify-between gap-5 sm:flex-col">
                    <Img
                        src="img_header_logo.png"
                        width={256}
                        height={60}
                        alt="Headerlogo"
                        className="h-[60px] w-[256px] self-center object-contain"
                    />
                    <div className="relative h-[40px] w-[8%] content-end px-2.5 md:h-auto sm:w-full">
                        <Text className="mx-auto font-roboto text-[26px] font-medium tracking-[0.10px] text-blue_gray-800 md:text-[24px sm:text-[22px]">
                            Log out
                        </Text>
                        <Text className="mx-auto font-roboto text-[26px] font-medium tracking-[0.10px] text-blue_gray-800 md:text-[24px] sm:text-[22px]">
                            Log out
                        </Text>
                    </div>
                </div>
            </div>
        </header>
    );
}
