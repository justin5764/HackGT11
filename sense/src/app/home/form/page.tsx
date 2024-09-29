import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "welcome",
    description: "Form created to assess a person's emotional wellbeing",
};

export default function FormPage() {
    return <Page />;
}