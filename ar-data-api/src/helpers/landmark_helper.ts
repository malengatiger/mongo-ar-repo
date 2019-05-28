import * as mongoose from "mongoose";
import Landmark from "../models/landmark";
import Route from "../models/route";

export class LandmarkHelper {
  public static async onLandmarkAdded(event: any) {
    console.log(`Route event has occured ....`);
    console.log(event);
    // tslint:disable-next-line: max-line-length
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  route in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${
        event.fullDocument._id
      } 🍎 `,
    );
    console.log(
      `\n👽 👽 👽 👽 👽 👽 👽  LandmarkHelper: Happiness Two: 🍎 🍎  onRouteAdded, Houston!! 👽 👽 👽\n\n`,
    );
  }
  public static async addLandmark(
    name: string,
    latitude: number,
    longitude: number,
    color: string,
    routes: string[],
  ): Promise<any> {

    console.log(
      `\n👽 👽 👽 👽  LandmarkHelper: MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`,
    );
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);
    const list: Route[] = [];
    for (const routeId of routes) {
      const route = await routeModel.findById(routeId);
      list.push(route);
    }
    const u = new landmarkModel({
      color,
      location: {
        coordinates: [longitude, latitude],
        type: "Point",
      },
      name,
      routes: list,
    });
    const m = await u.save();
    console.log(
      `\n\n💙  💚  💛   LandmarkHelper: Yebo Gogo!!!! - MongoDB has saved ${name} !!!!!  💙  💚  💛`,
    );

    const ass = await landmarkModel.findByName("MongoDataX Taxi Route");
    console.log(`💛 💛 💛 💛  Route found in Mongo: 💚  ${ass}`);
    console.log(ass);

    return m;
  }

  public static async addRoute(landmarkID: string, routeID: string): Promise<any> {
    console.log(` 🌀 findAll ....   🌀  🌀  🌀 `);
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);

    const route = await routeModel.findById(routeID);
    console.log(route);
    const mark: any = await landmarkModel.findById(landmarkID);
    if (!mark.routes) {
      mark.routes = [];
    }
    mark.routes.push(route);
  }

  public static async findAll(): Promise<any> {
    console.log(` 🌀 findAll ....   🌀  🌀  🌀 `);
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    landmarkModel.find((err: any, landmarks: any) => {
      if (err) {
        throw new Error(`Unable to find landmarks: ${err}`);
      } else {
        console.log(` 🌀 findAll ....  landmarks found: ${landmarks.length} 🌀  🌀  🌀 `);
        console.log(landmarks);
        return landmarks;
      }
    });
  }
  public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
  ) {
    console.log(`findByLocation ....${latitude} ${longitude}`);
    const METERS_PER_KM = 1000;
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const list: any = await landmarkModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            coordinates: [longitude, latitude],
            type: "Point",
          },
          $maxDistance: radiusInKM * METERS_PER_KM,
        },
      },
    }).catch((err) => {
      console.error(err);
    });
    console.log(` 🏓  🏓  landmarks found ${list.length}`);
    console.log(list);
    return list;
  }
}
