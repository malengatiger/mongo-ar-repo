import * as mongoose from "mongoose";
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
    const list: any[] = [];
    for (const id of assocs) {
      const ass = await assModel.findById(id);
      list.push(ass);
    }

    if (!color) {
      color = "BLUE";
    }
    const route = new routeModel({
      associations: list,
      color,
      name,
    });
    const m = await route.save();
    console.log(
      `\n\n💙 💚 💛  RouteHelper: Yebo Gogo!!!! - saved  🔆 🔆  ${name}  💙  💚  💛`,
    );
    return m;
  }

  public static async getRoutes(): Promise<any> {
    console.log(` 🌀 getRoutes ....   🌀  🌀  🌀 `);
    const routeModel = new Route().getModelForClass(Route);
    const list = await routeModel.find();
    return list;
  }
}
