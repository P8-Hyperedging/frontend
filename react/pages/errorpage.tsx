import { errorCodeCatImage } from "../components/error_cats.tsx";
import { DefaultPage } from "../components/default_templates.tsx";
import { ReactElement } from "react";

export function ErrorPage({
  errorCode,
  errorMessage,
}: {
  errorCode: number;
  errorMessage: string;
}): ReactElement {
  return (
    <DefaultPage
      title={errorMessage}
      content={
        <>
          <h1 className="text-xl">{errorMessage}</h1>
          {errorCodeCatImage(errorCode)}
        </>
      }
    />
  );
}
