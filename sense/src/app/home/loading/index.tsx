import { Text } from "../../components";
import Header1 from "../../components/Header1";
import React from "react";
import NavBar from "../../components/NavBar";

export default function LoadingPage() {
    return(
        <div>
            <NavBar showNext={false} showPrevious={false} showForm={false}/>
            <div className="flex w-full flex-col items-center gap-[274px] bg-white-a700 md:gap-[205px] sm:gap-[137px]">
                <Header1 className="bg-blue_gray-100" />
                <div className="mx-auto mb-1 flex w-full max-w-[1208px] flex-col items-center self-stretch md:px-5">
                    <Text size="text8xl" as="p" className="text-[80px] font-normal text-black-900 md:text-[48px]">
                        Welcome back
                    </Text>
                    <Text size="text8xl" as="p" className="mt-[88px] text-[80px] font-normal text-black-900 md:text-[48px]">
                        Let's get started
                    </Text>
                    <Text size="text8xl" as="p" className="mt-[50px] text-[80px] font-normal text-black-900 md:text-[48px]">
                        Please fill out the following form.
                    </Text>
                </div>
            </div>
        </div>
    );
}