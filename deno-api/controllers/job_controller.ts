import {get_all_jobs} from "../services/job_service.ts";
import {JsonResponse} from "../responses.ts";


export async function get_jobs() {
    const jobs = await get_all_jobs();

    return JsonResponse(jobs);
}