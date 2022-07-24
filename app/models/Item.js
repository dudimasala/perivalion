import { Realm } from "@realm/react";
export class Item extends Realm.Object {
  static schema = {
    name: "Item",
    primaryKey: "item",
    properties: {
      item: "string",
      materials: "string[]"
    },
  };
}
