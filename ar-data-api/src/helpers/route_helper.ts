import * as mongoose from "mongoose";
import v1 from "uuid/v1";
import Association from "../models/association";
import Route from "../models/route";
// TODO - build web map with 🍎 🍎 🍎 Javascript Maps API for creating manual snap feature
export class RouteHelper {
  public static async onRouteAdded(event: any) {
    // tslint:disable-next-line: max-line-length
    console.log(
      `\n👽 👽 👽 onRouteChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  route in stream:  🍀  🍀  🍎 `,
    );
  }
  public static async addRoute(
    name: string,
    assocs: string[],
    color: string,
  ): Promise<any> {

    const routeModel = new Route().getModelForClass(Route);
    const assModel = new Association().getModelForClass(Association);
    const list1: any[] = [];
    const list2: any[] = [];

    for (const id of assocs) {
      const ass = await assModel.findByAssociationID(id);
      list1.push(ass.associationID);
      list2.push({
        associationID: ass.associationID,
        associationName: ass.associationName,
      })
    }

    if (!color) {
      color = "BLUE";
    }
    const routeID = v1();
    const route = new routeModel({
      associationDetails: list2,
      associationIDs: list1,
      color,
      name,
      routeID,
    });
    const m = await route.save();
    console.log(
      `\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`,
    );
    return m;
  }

  public static async getRoutes(): Promise<any> {
    console.log(` 🌀 getRoutes find all routes in Mongo ....   🌀  🌀  🌀 `);
    const routeModel = new Route().getModelForClass(Route);
    const list = await routeModel.find();
    return list;
  }
}
