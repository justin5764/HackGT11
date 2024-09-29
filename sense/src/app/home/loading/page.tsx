import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "loading",
    description: "Loading screen, tells you to fill out the following form"
};

export default function LoadingPage(){
    return <Page />
}
