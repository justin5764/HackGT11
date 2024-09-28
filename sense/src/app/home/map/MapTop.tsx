import { Text } from "../../components";
import React from "react";

export default function MapTop() {
    return (
        <div className="flex justify-center px-14 md:px-5">
            <Text size="textlg" as="p" className="text-[39px] font-normal text-black-900 md:text-[37px] sm:text-[35px]">
                Based on your responses, here is a map of potential sources of help
            </Text>
        </div>
    );
}