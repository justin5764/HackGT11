import { Text, Heading } from "../../components";
import Link from "next/link";
import React from "react";
import NavBar from "@/app/components/NavBar";
import Image from 'next/image';

export default function ArticlePage() {
    return (
        <div className="flex w-full flex-col items-start gap-[54px] bg-white-a700 sm:gap-[27px]">
            <div className="self-stretch"> 
                <header className="flex h-[150px] items-end bg-[url(/images/header.png)] bg-cover bg-no-repeat px-3.5 py-[38px] md:h-auto sm:py-5">
                <NavBar showForm={false} showPrevious={true} showNext={true} />
                </header>
            </div>
            <Text size="text4xl" as="p" className="mb-1 ml-6 text-[62px] font-normal text-black-900 md:ml-0 md:text-[48px]">
                Overcoming{" "}
            </Text>
        </div>
    );
} 