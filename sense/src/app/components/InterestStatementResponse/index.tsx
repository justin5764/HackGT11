import { Button, Text } from "./..";
import React from "react";

interface Props{
    className?: string;
    interestStatementText?: React.ReactNode;
    notAtAllButton?: string;
    severalDaysButton?: string;
    moreThanHalfButton?: string;
    nearlyEveryDayButton?: string;
    everyDayButton?: string;
}

export default function InterestStatementResponse({
    interestStatementText = "I feel little interest or pleasure in doign things.",
    notAtAllButton = "Not at all",
    severalDaysButton = "Several days",
    moreThanHalfButton = "More than half the days",
    nearlyEveryDayButton = "Nearly every day",
    everyDayButton = "Every day",
    ...props
}: Props) {
    return(
        <div {...props} className={`${props.className} flex flex-col items-start gap[18px] flex-1 container-xs`}>
            <Text
            size="textmd"
            as="p"
            className="ml-2.5 text-[35px] font-normal text-black-900 md:ml-0 md:text-[33px] sm:text-[31px]"
            >
                {interestStatementText}
            </Text>
            <div className="flex justify-between gap-5 self-stretch md:flex-col">
                <Button
                shape="round"
                className="min-w-[170px] rounded-[30px] border-[0.5px] border-solid border-black-900 px-6 font-roboto font-medium tracking-[0.10px] text-black-900 sm:px-5"
                >
                    {notAtAllButton}
                </Button>
                <Button
                shape="round"
                className="min-w-[170px] rounded-[30px] border-[0.5px] border-solid border-black-900 px-6 font-roboto font-medium tracking-[0.10px] text-black-900 sm:px-5"
                >
                    {severalDaysButton}
                </Button>
                <Button
                shape="round"
                className="min-w-[170px] rounded-[30px] border-[0.5px] border-solid border-black-900 px-6 font-roboto font-medium tracking-[0.10px] text-black-900 sm:px-5"
                >
                    {moreThanHalfButton}
                </Button>
                <Button
                shape="round"
                className="min-w-[170px] rounded-[30px] border-[0.5px] border-solid border-black-900 px-6 font-roboto font-medium tracking-[0.10px] text-black-900 sm:px-5"
                >
                    {nearlyEveryDayButton}
                </Button>
                <Button
                shape="round"
                className="min-w-[170px] rounded-[30px] border-[0.5px] border-solid border-black-900 px-6 font-roboto font-medium tracking-[0.10px] text-black-900 sm:px-5"
                >
                    {everyDayButton}
                </Button>
            </div>
        </div>
    );
}
