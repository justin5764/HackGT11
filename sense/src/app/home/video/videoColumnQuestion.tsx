import { Button, Text } from "../../components";
import react from "react";

export default function RecordVideo() {
    return(
        <div className="mb-1 flex flex-col items-center gap-[58px] px-14 md:px-5 sm:gap-29px]">
            <Text size="text7xl" as="p" className="text-[72px] font-normal text-black-900 md:text-[48px]">
                Question 1: 
            </Text>
            <div className="flex">
                <Button
                    color="deep_purple_50"
                    size="md"
                    shape="square"
                    className="min-w-[388px] border border-solid border-gray-600px-[33px] font-roboto font-medium tracking-[0.10px] sm:px-5"
                >
                    Record Answer 
                </Button>"
            </div>
            <div className="mx-auto h-[590px] w-full max-w-[1094px] bg-blue_gray-100 md:px-5" />
        </div>
    );
}
