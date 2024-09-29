import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "Diagnostics", 
    description: "Page telling you what we diagnose you with depending on your answers",
};

export default function DiagnosisPage() {
    return <Page />;
}