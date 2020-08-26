import type { MutationFunctionOptions } from "@apollo/react-common";
import type { ExecutionResult } from "@apollo/react-common/lib/types/types";
import { useMutation } from "@apollo/react-hooks";
import { MutationUpdaterFn } from "apollo-client";
import { DocumentNode } from "graphql";
import { debounce } from "lodash";
import { useRef, useEffect, useState } from "react";

export function useDidMountEffect(func: () => void, deps: any[]) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export function useNow(interval: "second" | "minute" = "minute") {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const handle = setInterval(
      () => setNow(new Date()),
      interval === "second" ? 1 * 1000 : 60 * 1000
    );

    return () => clearInterval(handle);
  }, []);

  return now;
}

export function useDebouncedMutation<
  MutationData = any,
  MutationVariables = any
>({
  mutationDocument,
  makeUpdateFunction,
  wait = 250,
}: {
  mutationDocument: DocumentNode;
  makeUpdateFunction?: (
    variables?: MutationVariables
  ) => MutationUpdaterFn<MutationData>;
  wait?: number;
}) {
  const [originalMutation] = useMutation<MutationData, MutationVariables>(
    mutationDocument
  );

  const abortController = useRef<AbortController>();
  const debouncedMutation = useRef(
    debounce(
      async (
        mutationFunc: ({
          variables,
        }: MutationFunctionOptions<MutationData, MutationVariables>) => Promise<
          ExecutionResult<MutationData>
        >,
        variables?: MutationVariables
      ) => {
        // eslint-disable-next-line
        const controller = new AbortController();
        abortController.current = controller;

        await mutationFunc({
          variables,
          context: { fetchOptions: { signal: controller.signal } },
        });
      },
      wait
    )
  );

  const abortLatest = () =>
    abortController.current && abortController.current.abort();

  const mutationWithOptimisticUI = async ({
    variables,
    context,
  }: MutationFunctionOptions<MutationData, MutationVariables>) => {
    let update = undefined;

    if (makeUpdateFunction) {
      update = makeUpdateFunction(variables);
    }

    return await originalMutation({
      variables,
      context,
      update,
    });
  };

  return async (newVariables?: MutationVariables) => {
    abortLatest();
    return await debouncedMutation.current(
      mutationWithOptimisticUI,
      newVariables
    );
  };
}
