import { Heading, Img } from "../../components";
import RecordVideo from "./videoColumnQuestion";
import Link from "next/link";
import React from "react";
import NavBar from "../../components/NavBar";

export default function VideoPage() {
    return(
        <div>
            <NavBar showPrevious={true} showNext={true} showForm={true} />
            <RecordVideo />
        </div>
    )
}

