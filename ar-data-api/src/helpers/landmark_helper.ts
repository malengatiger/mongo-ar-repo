import * as mongoose from "mongoose";
import Landmark from "../models/landmark";
import Route from "../models/route";

export class LandmarkHelper {
  public static async onLandmarkAdded(event: any) {
    console.log(`Route event has occured ....`);
    console.log(event);
    // tslint:disable-next-line: max-line-length
    console.log(
      `\noperationType: 👽 👽 👽  ${
        event.operationType
      },  landmark in stream:   🍀   🍀  ${
        event.fullDocument.landmarkName
      } 🍎  `,
    );
  }
  public static async addLandmark(
    name: string,
    latitude: number,
    longitude: number,
    routes: string[],
  ): Promise<any> {
    if (!latitude || !longitude) {
      throw new Error("Missing coordinates");
    }
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);
    const list: Route[] = [];
    for (const routeId of routes) {
      const route: any = await routeModel.findById(routeId);
      console.log(
        `\n\nRoute from Mongo : 😍 😍 😍  id: ${route.id}  🌀  ${
          route.name
        }  😍 😍 😍`,
      );
      list.push(route);
    }
    console.log(`....... 😍 😍 😍  about to add landmark: ${name}`);
    const landmark = new landmarkModel({
      landmarkName: name,
      position: {
        coordinates: [longitude, latitude],
        type: "Point",
      },
      routes: list,
    });
    const m = await landmark.save();
    console.log(`\n👽 👽 👽 👽 👽 👽 👽 👽  Landmark added  🍎  ${name} \n\n`);
    return m;
  }

  public static async addRoute(
    landmarkID: string,
    routeID: string,
  ): Promise<any> {
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
    console.log(` 🌀 LandmarkHelper: findAll ....   🌀  🌀  🌀 `);
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const list = await landmarkModel.find();
    console.log(
      ` 🌀 LandmarkHelper: findAll .... found: ${list.length}   🌀  🌀  🌀 `,
    );

    console.log(list);
    return list;
  }
  public static async findByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
  ) {
    // tslint:disable-next-line: max-line-length
    console.log(
      `\n💦 💦  find landmarks ByLocation .... 🔆 lat: ${latitude}  🔆 lng: ${longitude} radiusInKM: ${radiusInKM}`,
    );
    const RADIUS = radiusInKM * 1000;
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const list: any = await landmarkModel
      .find({
        position: {
          $near: {
            $geometry: {
              coordinates: [longitude, latitude],
              type: "Point",
            },
            $maxDistance: RADIUS,
          },
        },
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(
      `\n🏓  🏓  landmarks found by location & radius:  ${
        list.length
      }  💙 💚 💛\n`,
    );
    list.forEach((m) => {
      console.log(`💙 💚 💛  ${m.landmarkName} 🔆🔆 ${m.position.coordinates}`);
    });
    return list;
  }
}
