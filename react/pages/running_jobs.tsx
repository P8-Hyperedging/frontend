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
  const modalId = `job-modal-${job.id}`;
  const config = statusConfig[job.state] ?? {
    bg: "bg-base-200 border-base-300",
    badge: "badge-ghost",
    dot: "bg-base-content/30",
  };

  return (
    <>
      <li
        className={`
          ${config.bg} p-3 border rounded flex items-center gap-3
          cursor-pointer transition-all duration-150
          hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
        `}
        onClick={() =>
          (document.getElementById(modalId) as HTMLDialogElement)?.showModal()}
      >
        <span className={`material-icons text-xl shrink-0 ${config.iconColor}`}>
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base-content truncate">
            {job.title}
          </div>
          <div className="text-sm text-base-content/60">
            {jobStateToText(job.state)}
          </div>
        </div>
        <span className={`badge badge-sm ${config.badge}`}>
          {jobStateToText(job.state)}
        </span>
      </li>

      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-1">{job.title}</h3>
          <p className="text-base-content/60 text-sm mb-4">{job.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className={`material-icons text-base ${config.iconColor}`}>
              {config.icon}
            </span>
            <span className={`badge ${config.badge}`}>
              {jobStateToText(job.state)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <JobField label="Model" value={job.model_name} icon="memory" />
            <JobField label="Seed" value={job.seed} icon="casino" />
            <JobField
              label="Hidden Layer Size"
              value={job.hidden_layer_size}
              icon="hub"
            />
            <JobField label="Epochs" value={job.epochs} icon="repeat" />
            <JobField
              label="Learning Rate"
              value={job.learning_rate}
              icon="trending_up"
            />
            <JobField
              label="Weight Decay"
              value={job.weight_decay}
              icon="compress"
            />
            <JobField label="Dropout" value={job.dropout} icon="filter_alt" />
            <JobField
              label="Train Proportion"
              value={job.train_proportion}
              icon="pie_chart"
            />
            <JobField label="Patience" value={job.patience} icon="timer" />
            <JobField
              label="Duration"
              value={job.duration ? `${job.duration}s` : "—"}
              icon="hourglass_bottom"
            />
            <JobField
              label="Started"
              value={job.started?.toLocaleString() ?? "—"}
              icon="play_arrow"
            />
            <JobField
              label="Finished"
              value={job.finished?.toLocaleString() ?? "—"}
              icon="stop"
            />
          </div>

          <div className="text-xs text-base-content/40 mt-4">
            Created {job.created_at.toLocaleString()}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

function JobField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-base-200 rounded-lg p-3 flex items-center gap-3">
      <span className="material-icons text-base text-base-content/40">
        {icon}
      </span>
      <div>
        <div className="text-xs text-base-content/50">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
