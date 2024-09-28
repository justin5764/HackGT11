import { Text } from "../../components";
import InterestStatementResponse from "../../components/InterestStatementResponse";
import React, { Suspense } from "react";

const data = [
    {
        interestStatementText: "I feel little interest or pleasure in doing things.",
        notAtAllButton: "Not at all",
        severalDaysButton: "Several days",
        moreThanHalfButton: "More than half the days",
        nearlyEveryDayButton: "Nearly every day",
        everyDayButton: "Every day",
    },
    {
        interestStatementText: "I feel little interest or pleasure in doing things.",
        notAtAllButton: "Not at all",
        severalDaysButton: "Several days",
        moreThanHalfButton: "More than half the days",
        nearlyEveryDayButton: "Nearly every day",
        everyDayButton: "Every day",
    },
    {
        interestStatementText: "I feel little interest or pleasure in doing things.",
        notAtAllButton: "Not at all",
        severalDaysButton: "Several days",
        moreThanHalfButton: "More than half the days",
        nearlyEveryDayButton: "Nearly every day",
        everyDayButton: "Every day",
    },
    {
        interestStatementText: "I feel little interest or pleasure in doing things.",
        notAtAllButton: "Not at all",
        severalDaysButton: "Several days",
        moreThanHalfButton: "More than half the days",
        nearlyEveryDayButton: "Nearly every day",
        everyDayButton: "Every day",
    },
    {
        interestStatementText: "I feel little interest or pleasure in doing things.",
        notAtAllButton: "Not at all",
        severalDaysButton: "Several days",
        moreThanHalfButton: "More than half the days",
        nearlyEveryDayButton: "Nearly every day",
        everyDayButton: "Every day",
    },
];

export default function FormColumnForm() {
    return (
        <div className="flex flex-col items-center gap-[72px] self-stretch px-14 md:gap-[54px] md:px-5 sm:gap-9">
            <Text as="p" className="text-[70px] font-normal text-black-900 md:text-[48px]">
                Form
            </Text>
            <div className="container-xs flex flex-fol items-start gap-[52px] sm:gap-[26px]">
                <div className="flex flex-col gap-52px] self-stretch">
                    <Suspense fallback={<div>Loading feed...</div>}>
                        {data.map((d, index) => (
                            <InterestStatementResponse {...d} key={"form" + index} />
                        ))}
                    </Suspense>
                </div>
                <Text
                    size="textmd"
                    as="p"
                    className="ml-2 text-[35px] font-normal text-black-900 md:ml-0 md:text-[33px] sm:text-[31px]"
                >
                    I feel that I am a failure or have let myself or my family down
                </Text>
            </div>
        </div>
    );
}
