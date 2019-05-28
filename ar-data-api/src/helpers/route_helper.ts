import * as mongoose from "mongoose";
import Route from "../models/route";

export class RouteHelper {
  public static async onRouteAdded(event: any) {
    console.log(`Route event has occured ....`);
    console.log(event);
    // tslint:disable-next-line: max-line-length
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  route in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${
        event.fullDocument._id
      } 🍎 `
    );
    console.log(
      `\n👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 RouteHelper: Happiness Two: 🍎 🍎  onRouteAdded, Houston!! 👽 👽 👽\n\n`
    );
  }
  public static async addRoute(
    name: string,
    associationID: string,
    associationName: string,
    color: string
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  🌀  RouteHelper: addRoute   🍀   ${name} -   🍀   ${associationID}   🍀   ${associationName}\n`
    );
    console.log(
      // tslint:disable-next-line: max-line-length
      `\n👽 👽 👽 👽  RouteHelper: attempting MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`
    );

    const routeModel = new Route().getModelForClass(Route);
    const u = new routeModel({
      associationID,
      associationName,
      color,
      name
    });
    const m = await u.save();
    console.log(
      `\n\n💙  💚  💛   RouteHelper: Yebo Gogo!!!! - MongoDB has saved ${name} !!!!!  💙  💚  💛`
    );

    const ass = await routeModel.findByName("MongoDataX Taxi Route");
    console.log(`💛 💛 💛 💛  Route found in Mongo: 💚  ${ass}`);
    console.log(ass);
    console.log(
      `🏓  db: ${m.db.db.databaseName} 💛 💛 collection: ${
        m.collection.collectionName
      } 💙 💙  id: ${m.id}`
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
