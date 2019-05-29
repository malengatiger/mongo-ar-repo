import { Request, Response } from "express";
import Migrator from "../migration/migrator";

export class AppExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    AppExpressRoutes:  💙  setting up default home routes ...`,
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
        `\n\n💦  pinged!. 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      res.status(200).json({
        message: `🏓  🏓 pinged : 💙  ${new Date()}  💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
      });
    });
    app.route("/startMigrator").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  /startMigrator!. 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      const result = await Migrator.start();
      res.status(200).json({
        message: `🏓  🏓  startMigrator : 💙  ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
        result,
      });
    });
  }
}
