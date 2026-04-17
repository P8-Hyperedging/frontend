import { errorCodeCatImage } from "../components/error_cats";
import { DefaultPage } from "../components/default_templates";
import { ReactElement } from "react";

export function ErrorPage({
  errorCode,
  errorMessage,
}: { errorCode: number; errorMessage: string }): ReactElement {
  return (
    <DefaultPage
      title={errorMessage}
      content={
        <div className="flex flex-col w-full items-center gap-4">
          <div className="w-1/2 flex flex-col items-center bg-base-200 border-base-300 rounded-box border p-4">
            <h1 className="text-xl">{errorMessage}</h1>
            {errorCodeCatImage(errorCode)}
          </div>
        </div>
      }
    />
  );
}
