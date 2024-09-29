import { Text } from "../../components";
import React from "react";

export default function WelcomePage() {
    return(
        <div className="flex h-[1300px] w-full items-end justify-center bg-indigo-900 bg-[url(/images/img_welcome.png)] bg-cover bg-no-repeat px-14 py-[390px] md:h-auto md:p-5">
            <div className="mt-[98px] flex w-[72%] flex-col items-center justify-center gap-0.5 bg-white-a700 px-14 py-28 md:w-full md:p-5">
                <Text
                    size="text2xl"
                    as="p"
                    className="mt-2.5 text-[50px] font-normal text-black-900 md:text-[46px] sm:text-[40px]"
                >
                    Welcome To
                </Text>
                <Text as="p" className="self-end text-[70px] font-normal leading-[84px] text-black-900 md:text-[48px]">
                    <>
                        sense logo
                        <br />
                    </>
                </Text>
            </div>
        </div>
    );
}