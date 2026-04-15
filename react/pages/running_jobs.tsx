// @ts-ignore
import React, {useEffect, useRef, useState} from "react";
import {DefaultPage} from "../components/default_templates";
import {ServerTerminal} from "../components/server_terminal";

export function RunningJobPage() {
    return (
        <DefaultPage
            title="Running Jobs"
            content={
                <>
                    <div class="flex flex-col px-5">
                        <div className="flex h-20 justify-center items-center">
                            <h1 className="flex items-center gap-2 text-2xl">
                                <i className="material-icons">work_history</i>
                                <span>Running Jobs</span>
                            </h1>
                        </div>
                        <div class="flex flex-row w-full gap-10">
                            <div class="flex-1" p-5>
                                <h1 class="flex-1 items-center text-center gap-2 text-2xl">Queue</h1>
                            </div>
                            <div className="flex-1">
                                <h1 class="flex-1 items-center text-center gap-2 text-2xl">Server terminal</h1>
                                <ServerTerminal/>
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}
