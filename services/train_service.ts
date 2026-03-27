import { RedirectResponse } from "../reponses.ts";

export default function post_train(url: URL) {
    return RedirectResponse("/running-jobs")
}