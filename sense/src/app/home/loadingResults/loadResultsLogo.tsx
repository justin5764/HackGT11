import { Text } from "../../components";
import React from "react";


export default function LoadResultsLogo() {
    return (
        <div className="flex h-[150px] items-end self-stretch bg-[url(/images/header.png)] bg-cover bg-no-repeat px-3.5 py-[38px] md:h-auto sm:py-5">
            <Text size="text2xl" as="p" className="mt-3 text-[50px] font-normal text-black-900 md:text-[46px] sm:text-[40px]">
                <img src="images/logo.png" />
            </Text>
        </div>
    );
}