import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { RouteHelper } from "../helpers/route_helper";

export class RouteExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    RouteExpressRoutes: 💙  setting up default express routes ...`,
    );
    /////////
    app.route("/addRoute").post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /routes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = await RouteHelper.addRoute(
            req.body.name,
            req.body.associations,
            req.body.color,
          );
          console.log("about to return result from Helper ............");
          res.status(200).json({
            message: `🏓  🏓  route: ${req.body.name} :
            🏓  ${req.body.associationName}: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          res.status(400).json({
            error: err,
            message: `👿 👿 👿  AR MongoDB API fucked up`,
          });
        }
      });
     /////////
    app.route("/getRoutes").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getRoutes requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      try {
        const result = await RouteHelper.getRoutes( );
        console.log("\n................ about to return result from Helper ............");
        console.log(result);
        res.status(200).json({
          message: `🏓  🏓  getRoutes OK :: 🔆 ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
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
