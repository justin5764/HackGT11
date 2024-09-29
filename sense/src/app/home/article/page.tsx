import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "article", 
    description: "Page showing articles on how to get help for your diagnostic",
};

export default function ArticlePage() {
    return <Page />;
}