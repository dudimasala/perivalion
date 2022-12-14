//Schema for storing bin coordinates

//Called Bin.js but this is now extended to recycling points in Hong Kong
import { Realm } from "@realm/react";
export class Bin extends Realm.Object {
    // To use a class as a Realm object type, define the object schema on the static property "schema".
    static schema = {
      name: "Bin",
      primaryKey: "_id",
      properties: {
        _id: "objectId",
        address: "string",
        lat: "double",
        lng: "double"
        //latitude: "double",
        //longitude: "double"
      },
    };

  
  }