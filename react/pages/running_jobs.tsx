import { useEffect, useState } from "react";
import { DefaultPage } from "../components/default_templates.tsx";
import { ServerTerminal } from "../components/server_terminal.tsx";
import { Job, JobStateEnum, State } from "@shared/train.ts";

function jobStateToText(state: JobStateEnum) {
  switch (state) {
    case State.DONE:
      return "Done";
    case State.RUNNING:
      return "Running";
    case State.FAILED:
      return "Running Failed";
    case State.PENDING:
      return "Pending";
    default:
      return "Unknown";
  }
}

export function RunningJobPage() {
  const [jobs, setJobs] = useState<Job>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const hasActiveJobs = jobs.some(
    (j: Job) => j.state === State.RUNNING || j.state === State.PENDING,
  );

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data.rows ?? data);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
    const id = setInterval(fetchJobs, hasActiveJobs ? 5000 : 60000);
    return () => clearInterval(id);
  }, [hasActiveJobs]); // re-evaluates when active state changes

  return (
    <DefaultPage
      title="Running Jobs"
      content={
        <>
          <div className="flex flex-col w-full">
            <div className="flex h-20 justify-center items-center">
              <h1 className="flex items-center gap-2 text-2xl">
                <i className="material-icons">work_history</i>
                <span>Running Jobs</span>
              </h1>
            </div>

            <div className="flex flex-row w-full gap-10">
              <div className="basis-1/3">
                <h1 className="text-center text-2xl mb-4">Queue</h1>

                {loading ? <p>Loading...</p> : (
                  <ul className="space-y-2">
                    {jobs.map((job: Job) => <JobItem key={job.id} job={job} />)}
                  </ul>
                )}
              </div>

              <div className="basis-2/3">
                <h1 className="text-center text-2xl mb-4">Server terminal</h1>
                <ServerTerminal />
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

const statusConfig: Record<
  JobStateEnum,
  { bg: string; badge: string; icon: string; iconColor: string }
> = {
  [State.RUNNING]: {
    bg: "bg-success/10 border-success/30",
    badge: "badge-success",
    icon: "play_circle",
    iconColor: "text-success",
  },
  [State.PENDING]: {
    bg: "bg-warning/10 border-warning/30",
    badge: "badge-warning",
    icon: "schedule",
    iconColor: "text-warning",
  },
};

function JobItem({ job }: Job) {
  const config = statusConfig[job.state] ?? {
    bg: "bg-base-200 border-base-300",
    badge: "badge-ghost",
    dot: "bg-base-content/30",
  };

  return (
    <li className={`${config.bg} p-3 border rounded flex items-center gap-3`}>
      <span className={`material-icons text-xl shrink-0 ${config.iconColor}`}>
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-base-content truncate">{job.title}</div>
        <div className="text-sm text-base-content/60">
          {jobStateToText(job.state)}
        </div>
      </div>
      <span className={`badge badge-sm ${config.badge}`}>
        {jobStateToText(job.state)}
      </span>
    </li>
  );
}
