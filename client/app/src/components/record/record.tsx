import React from "react";
import { useSelector } from "../redux/store";
import { BackHomeHeader } from "../header/header";
import "./css/record.css";
import "../util/css/util.css";

export function CreateRecord() {
    const selectDate = useSelector((state) => state.selectDate.value);
    return (
        <div className="container">
            <BackHomeHeader />
            <div className="contentBody">
                <h1>記録作成</h1>
                {selectDate}
            </div >
        </div >
    )
}
