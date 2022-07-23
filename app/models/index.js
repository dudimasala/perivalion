import { createRealmContext } from "@realm/react";
import { Item } from "./Item";
import { Bin } from "./Bin";

export const TaskRealmContext = createRealmContext({
  schema: [Bin, Item],
});



