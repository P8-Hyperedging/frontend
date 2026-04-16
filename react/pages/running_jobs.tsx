// @ts-ignore
import React, { useEffect, useState } from "react";
import { DefaultPage } from "../components/default_templates";
import { ServerTerminal } from "../components/server_terminal";
import {jobStateToText, State} from "../../shared/job";


export function RunningJobPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch("/api/jobs"); // change if your endpoint differs
                const data = await res.json();
                console.log(data);
                setJobs(data.rows ?? data); // depends on backend shape
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

    return (
        <DefaultPage
            title="Running Jobs"
            content={
                <>
                    <div className="flex flex-col px-5">
                        <div className="flex h-20 justify-center items-center">
                            <h1 className="flex items-center gap-2 text-2xl">
                                <i className="material-icons">work_history</i>
                                <span>Running Jobs</span>
                            </h1>
                        </div>

                        <div className="flex flex-row w-full gap-10">
                            <div className="flex-1 p-5">
                                <h1 className="text-center text-2xl mb-4">Queue</h1>

                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {jobs.map((job) => (
                                            <li
                                                key={job.id}
                                                className={(job.state === State.RUNNING ? "bg-green-100" : "bg-yellow-100") + " p-3 border rounded"}
                                            >
                                                <div className="font-bold">
                                                    {job.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    State: {jobStateToText(job.state)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-center text-2xl mb-4">
                                    Server terminal
                                </h1>
                                <ServerTerminal />
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}