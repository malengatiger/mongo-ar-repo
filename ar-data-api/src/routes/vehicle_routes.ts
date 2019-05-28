import { Request, Response } from "express";
import { VehicleHelper } from "../helpers/Vehicle_helper";
import Util from "./util";

export class VehicleExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    VehicleExpressRoutes: 💙  setting up default Vehicle related express routes ...`,
    );

    app.route("/addVehicle").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addVehicle requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.addVehicle(
          req.body.vehicleReg,
          req.body.associationID,
          req.body.associationName,
          req.body.ownerID,
          req.body.ownerName,
          req.body.vehicleTypeID,
          req.body.photos,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app.route("/findVehiclesByLocation").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.findVehiclesByLocation(
          req.body.latitude,
          req.body.longitude,
          req.body.withinMinutes,
          req.body.radiusInKM,

        );
        res.status(200).json({
          message: `🏓  🏓  🏓  getVehiclesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app.route("/getVehiclesByAssociation").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByAssociation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.getVehiclesByAssociation(
          req.body.associationID,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addVehicle: ${req.body.vehicleReg} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app.route("/getVehiclesByOwner").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getVehiclesByOwner requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await VehicleHelper.getVehiclesByOwner(
          req.body.ownerID,
        );
        res.status(200).json({
          message: `🏓  🏓 getVehiclesByOwner: ${req.body.ownerID} OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app.route("/getAllVehicles").post(
      async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getAllVehicles requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await VehicleHelper.getVehicles();
        res.status(200).json({
          message: `🏓  🏓 getAllVehicles OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });

  }
}
