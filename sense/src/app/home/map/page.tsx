import React from "react";
import { Metadata } from "next";
import Page from "."; 

export const metadata: Metadata = {
    title: "map page",
    description: "Map showing local affordable healthcare locations",
};

export default function MapPage(){
    return <Page />;
}