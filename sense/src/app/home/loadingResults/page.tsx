import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "Loading your Results", 
    description: "Please be patient as we load your results",
};

export default function DiagnosisPage() {
    return <Page />;
}