import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "video page",
    description: "Asks user a question, then prompts them to respond via recording",
};

export default function VideoPage(){
    return <Page />;
}
