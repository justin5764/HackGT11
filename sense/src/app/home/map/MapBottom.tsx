import { Text } from "../../components";
import React from "react"

export default function MapBottom() {
    return(
        <div className="mb-1 flex flex-col items-center gap-[60px] px-14 md:px-5 sm:gap-[30px]">
            <div className="mx-auto h-[734px] w-full max-w=[1306px] self-stretch bg-blue_gray-100 md:px-5" />
            <Text
                size="texts"
                as="p"
                className="text-[34px] font-normal leading-[41px] text-black-900 md:text-[32px] sm:text-[30px]"
            >
                <>
                    Our recommendations for you are: <br />
                    hi <br />
                    hi <br />
                    hi <br/>
                </>
            </Text>
        </div>
    );
}