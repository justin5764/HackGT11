import { Text } from "../../components"; // Ensure this import is correct
import LoadResultsLogo from "./loadResultsLogo";
import React from "react";
import FadingText from "../../components/FadeText";

export default function LoadingResultsPage() {
    return (
        <div className="flex w-full flex-col items-center gap-[414px] bg-white-a700 md:gap-[310px] sm:gap-[207px]">
            <LoadResultsLogo />
            <FadingText />
        </div>
    );
}