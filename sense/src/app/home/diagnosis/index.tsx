import { Text } from "../../components";
import Header1 from "../../components/Header1";
import React from "react";

export default function DiagnosisPage() {
    return(
        <div className="flex w-full flex-col items-center gap-[60px] bg-white-a700 sm:gap-[30px]">
            <Header1 className="h-[150x] bg-[url(/images/header.png)] bg-cover bg-no-repeat px-3.5 py-[38px] md:h-auto sm:py-5" />
            <div className="mx-auto mb-1 flex w-full max-w-[1190px] flex-col items-start gap-[400px] self-stretch md:gap-[300px] md:px-5 sm:gap-[200px]">
                <Text size="text5xl" as="p" className="text-[67px] font-normal text-black-900 md:text-[48px]">
                    After evaluation, it appears that{" "}
                </Text>
                <Text size="text5xl" as="p" className="text-[67px] font-normal text-black-900 md:text-[48px]">
                    We would recommend
                </Text>
            </div>
        </div>
    );
}