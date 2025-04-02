import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@/common/constants/generic";
import { getAllTasks } from "@/store/services/createTask";
import { TaskEntity } from "@/common/entities/task";

export function getAllTasksQueryKey() {
  return ["tasks"];
}

export const getAllTasksQueryFn = () => {
  return () => getAllTasks();
};

export const useAllTasks = <T = TaskEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getAllTasksQueryKey(),
    queryFn: getAllTasksQueryFn(),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};