// LoadingResultsPage.js
import { Text } from "../../components";
import LoadResultsLogo from "./loadResultsLogo";
import React from "react";
import FadeText from "../../components/FadeText";

export default function LoadingResultsPage() {
    return (
        <div className="flex w-full flex-col items-center gap-[414px] bg-white-a700 md:gap-[310px] sm:gap-[207px]">
            <LoadResultsLogo />
            <FadeText /> {/* Use FadeText directly here */}
        </div>
    );
}
