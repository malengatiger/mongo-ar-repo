import { Request, Response } from "express";
import { AssocHelper } from "./../helpers/association_helper";

export class Routes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    Routes: setting up default home route ...`,
    );
    app.route("/").get((req: Request, res: Response) => {
      const msg = `🏓  🏓  🏓  home route picked   🌽 ${new Date().toISOString()}`;
      console.log(msg);
      res.status(200).json({
        message: msg,
      });
    });
    app.route("/ping").get((req: Request, res: Response) => {
      console.log(
        `\n\n💦  ping requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      res.status(200).json({
        message: `🏓  🏓  🏓  AR MongoDB API pinged : ${new Date()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });
    app.route("/associations").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  associations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await AssocHelper.addAssociation(
          req.body.name,
          req.body.email,
          req.body.cellphone,
        );
        console.log("about to return result from Helper ............");
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
  }
}
