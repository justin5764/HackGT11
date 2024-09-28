import React from "react";
import { Metadata } from "next";
import Page from ".";

export const metadata: Metadata = {
    title: "welcome",
    description: "Web site created using create-react-app",
};

export default function WelcomePage(){
    return <Page />;
}