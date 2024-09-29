import { Heading, Img } from "../../components";
import MapBottom from "./MapBottom";
import MapTop from "./MapTop"
import Link from "next/link";
import React from "react";
import NavBar from "../../components/NavBar";

export default function MapPage() {
    return (
        <div className="flex w-full flex-col gap-[34px] bg-white-a700">
            <div className="flex flex-col gap-4">
                <header className="flex h-[150px] items-end bg-[url(/images/header.png)] bg-cover bg-no-repeat px-3.5 py-[38px] md:h-auto sm:py-5">
                    <div className="container-sm mt-3 flex items-center justify-between gap-5 md:flex-col">
                    <NavBar showPrevious={true} showNext={true} showForm={true} />
                    </div>
                </header>
                <MapTop />
            </div>
            <MapBottom />
        </div>
    );
}