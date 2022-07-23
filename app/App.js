import React, { useMemo } from "react";

import { Item } from "./models/Item";
import { TaskRealmContext } from "./models";
import { TaskManager } from "./components/TaskManager";

const { useQuery } = TaskRealmContext;

export const App = () => {
  const result = useQuery(Item);

  const tasks = useMemo(() => result.sorted("createdAt"), [result]);

  return <TaskManager tasks={tasks} />;
};
