import { getDistance } from "geolib";
import { BulkWriteOpResultObject } from "mongodb";
import * as mongoose from "mongoose";
import Landmark from "../models/landmark";
import Route from "../models/route";

export class LandmarkHelper {
  public static async onLandmarkAdded(event: any) {
    console.log(
      `\n👽 👽 👽 onLandmarkChangeEvent: operationType: 👽 👽 👽  ${
        event.operationType
      },  landmark in stream:   🍀   🍀  ${
        event.fullDocument.landmarkName
      } 🍎  `,
    );
  }
  public static async addLandmarks(
    landmarks: any[],
    routeID: string,
  ): Promise<any> {
    const landmarkModel = new Landmark().getModelForClass(Landmark);
    const routeModel = new Route().getModelForClass(Route);
    const route = await routeModel.findById(routeID);
    console.log(
      `💦 💦  adding landmarks - 👽 route from mongo: 💦 💦 ${route.name}`,
    );
    const bulkWriteList: any = [];
    for (const m of landmarks) {
      if (m.latitude && m.longitude) {
        const landmark = new landmarkModel({
          landmarkName: m.landmarkName,
          position: {
            coordinates: [m.longitude, m.latitude],
            type: "Point",
          },
          routes: [route],
        });
        bulkWriteList.push({
          insertOne: {
            document: landmark,
          },
        });
      } else {
        console.warn(
          `\n\n👿👿👿👿👿👿👿👿👿👿👿👿👿 coordinates missing for ${
            m.landmarkName
          } 👿👿👿👿👿👿👿`,
        );
      }
    }
    console.log(
      `\n\n🍀 🍀 🍀 🍀  ..... about to write batch: ${
        bulkWriteList.length
      } 🍀 🍀`,
    );
    if (bulkWriteList.length === 0) {
      console.error(`👿👿👿👿👿👿👿 Ignoring empty batch ... 🍀  ciao!`);
      return;
    }
    try {
      const res: BulkWriteOpResultObject = await landmarkModel.bulkWrite(
        bulkWriteList,
      );
      console.log(
        `\n\n🍀 🍀 🍀 🍀  Batched: ${landmarks.length}. inserted: 🍎  ${
          res.insertedCount
        } 🍎`,
      );
      console.log(res);
    } catch (e) {
      console.error(
        `👿👿👿👿👿👿👿 Something fucked up! 👿👿👿👿👿👿👿👿\n`,
        e,
      );
    }
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
    const start = new Date().getTime();
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
    const end = new Date().getTime();
    console.log(
      `\n🏓  🏓  landmarks found:   🌺 ${
        list.length
      }  elapsed: 💙  ${(end - start) / 1000} seconds  💙 💚 💛\n`,
    );
    list.forEach((m) => {
      const route = m.routes[0];
      console.log(`💙 💚  ${m.landmarkName}  🍎 ${route.name}  💛`);
    });
    console.log(
      `\n\n🌺 🌸  Calculated distances between landmarks   🌺 🌸 🌺 🌸 🌺 🌸\n`,
    );
    this.calculateDistances(list, latitude, longitude);
    console.log(list);
    console.log(
      `\n💙 💙 💙 💙 💙 landmarks found:  🌸  ${
        list.length
      }  elapsed: 💙  ${(end - start) / 1000} seconds  💙 💚 💛\n`,
    );
    return list;
  }
  private static async calculateDistances(
    landmarks: any[],
    latitude: number,
    longitude: number,
  ) {
    const from = {
      latitude,
      longitude,
    };

    for (const m of landmarks) {
      const to = {
        latitude: m.position.coordinates[1],
        longitude: m.position.coordinates[0],
      };
      const dist = getDistance(from, to);
      m.distance = dist / 1000;
      console.log(
        `🌺 🌸  ${dist / 1000} km 💛 🍎  ${m.landmarkName}  🍀  ${m.routes[0].name}`,
      );
    }
  }
}
