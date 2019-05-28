import * as mongoose from "mongoose";
import Photo from "../models/photo";
import Vehicle from "../models/vehicle";
import VehicleLocation from "../models/vehicle_location";
import VehicleType from "../models/vehicle_type";

export class VehicleHelper {
  public static async onVehicleAdded(event: any) {
    console.log(`onVehicleAdded event has occured ....`);
    console.log(event);
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  vehicle in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${
        event.fullDocument._id
      } 🍎 `,
    );
  }
  public static async addVehicle(
    vehicleReg: string,
    associationID: string,
    associationName: string,
    ownerID: string,
    ownerName: string,
    vehicleTypeID: string,
    photos: string[],
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  🌀  VehicleHelper: addVehicle   🍀   ${name} -   🍀   ${associationID}   🍀   ${associationName}\n`,
    );
    console.log(
      // tslint:disable-next-line: max-line-length
      `\n👽 👽 👽 👽  VehicleHelper: attempting MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`,
    );

    const vehicleTypeModel = new VehicleType().getModelForClass(VehicleType);
    const type = vehicleTypeModel.findById(vehicleTypeID);
    const vehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = [];
    for (const url of photos) {
      const photo = new Photo();
      photo.url = url;
      list.push(photo);
    }

    const u = new vehicleModel({
      associationID,
      associationName,
      ownerID,
      ownerName,
      photos: list,
      vehicleReg,
      vehicleType: type,
    });
    const m = await u.save();
    return m;
  }

  public static async getVehicles(): Promise<any> {
    console.log(` 🌀 getVehicles ....   🌀  🌀  🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find();
    return list;
  }

  public static async addVehicleType(
    make: string,
    model: string,
    capacity: number,
    countryID: string,
    countryName: string,
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  VehicleHelper: addVehicleType  🍀  ${make} ${model} capacity: ${capacity}\n`,
    );

    const vehicleTypeModel = new VehicleType().getModelForClass(VehicleType);

    const u = new vehicleTypeModel({
      capacity,
      countryID,
      countryName,
      make,
      model,
    });

    const m = await u.save();
    return m;
  }

  public static async getVehicleTypes(): Promise<any> {
    console.log(` 🌀 getVehicleTypes ....   🌀  🌀  🌀 `);
    const vehicleModel = new VehicleType().getModelForClass(VehicleType);
    const list = await vehicleModel.find();
    return list;
  }
  public static async getVehiclesByOwner(ownerID: string): Promise<any> {
    console.log(` 🌀 getVehiclesByOwner ....   🌀  🌀  🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find({ownerID: ownerID});
    return list;
  }
  public static async getVehiclesByAssociation(associationID: string): Promise<any> {
    console.log(` 🌀 getVehiclesByAssociation ....   🌀  🌀  🌀 `);
    const VehicleModel = new Vehicle().getModelForClass(Vehicle);
    const list = await VehicleModel.find({associationID: associationID});
    return list;
  }

  public static async findVehiclesByLocation(
    latitude: number,
    longitude: number,
    withinMinutes: number,
    radiusInKM: number,
  ) {
    console.log(`findByLocation ....${latitude} ${longitude}`);
    const cutOff: number = new Date().getTime() - (withinMinutes * 60 * 1000);
    const METERS_PER_KM = 1000;
    const vehicleLocationModel = new VehicleLocation().getModelForClass(VehicleLocation);
    const list: any = await vehicleLocationModel.find({

      position: {
        $nearSphere: {
          $geometry: {
            coordinates: [longitude, latitude],
            type: "Point",
          },
          $maxDistance: radiusInKM * METERS_PER_KM,
        },
      },
      timestamp: { $gt: cutOff },

    }).catch((err) => {
      console.error(err);
    });
    console.log(` 🏓  🏓  vehicleLocations found ${list.length}`);
    console.log(list);
    return list;
  }
}
