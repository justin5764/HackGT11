import { Heading, Text } from "../../components";
import FormColumnform from "./FormColumnform";
import NavBar from '../../components/NavBar';
import React from "react";

export default function FormPage() {
    return(
        <div>
            <NavBar showNext={false} showPrevious={false} showForm={false}/>
            <div className="flex w-full flex-col gap-[22px] overflow-x-scroll bg-white-a700">
            <div className="flex w-[1440px] flex-col items-center gap-[18px]">
                <FormColumnform />
                <div className="container-xs flex justify between gap-5 self-stretch md:flex-col md:px-5">
                    <div className = "h-[62px] w-[14%] rounded-[30px] border-[0.5px] border-solid border-black-900 bg-cyan-200" />
                    <div className = "h-[62px] w-[14%] rounded-[30px] border-[0.5px] border-solid border-black-900 bg-cyan-200" />
                    <div className = "h-[62px] w-[14%] rounded-[30px] border-[0.5px] border-solid border-black-900 bg-cyan-200" />
                    <div className = "h-[62px] w-[14%] rounded-[30px] border-[0.5px] border-solid border-black-900 bg-cyan-200" />
                    <div className = "h-[62px] w-[14%] rounded-[30px] border-[0.5px] border-solid border-black-900 bg-cyan-200" />
                </div>
            </div>
        </div>
        </div>

    );
}
