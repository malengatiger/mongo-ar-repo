import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { LandmarkHelper } from "../helpers/landmark_helper";

export class LandmarkExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    LandmarkExpressRoutes: 💙  setting up default landmark related express routes ...`,
    );

    app.route("/addLandmark").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmark requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.addLandmark(
          req.body.name,
          req.body.latitude,
          req.body.longitude,
          req.body.color,
          req.body.routes,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  association: ${req.body.name} : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `👿 👿 👿  AR MongoDB API fucked up`,
        });
      }
    });

    app.route("/findLandmarksByLocation").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /findLandmarksByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.findByLocation(
          req.body.latitude,
          req.body.longitude,
          req.body.radiusInKM,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  findLandmarksByLocation: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `👿 👿 👿  AR MongoDB API fucked up`,
        });
      }
    });

    app.route("/addLandmarkRoute").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmarkRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await LandmarkHelper.addRoute(
          req.body.landmarkID,
          req.body.routeID,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addLandmarkRoute: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `👿 👿 👿  AR MongoDB API fucked up`,
        });
      }
    });
    app.route("/getLandmarks").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addLandmarkRoute requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await LandmarkHelper.findAll();
        res.status(200).json({
          message: `🏓  🏓  🏓  getLandmarks: OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        res.status(400).json({
          error: err,
          message: `👿 👿 👿  AR MongoDB API fucked up`,
        });
      }
    });

  }
}
