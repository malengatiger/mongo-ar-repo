import { Request, Response } from "express";
import { CityHelper, CountryHelper } from "../helpers/country_helper";
import Util from "./util";

export class CountryExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    CountryExpressRoutes: 💙  setting up default Country related express routes ...`,
    );

    app.route("/addCountry").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /addCountry requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CountryHelper.addCountry(
          req.body.name,
          req.body.countryCode,
        );
        res.status(200).json({
          message: `🏓  🏓  🏓  addCountry: ${
            req.body.CountryReg
          } OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });

    app.route("/getCountries").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getCountries requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CountryHelper.getCountries();
        res.status(200).json({
          message: `🏓  🏓  🏓  addCountry: ${
            req.body.CountryReg
          } OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app.route("/getCountryCities").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /getCountryCities requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await CityHelper.getCities(req.body.countryID);
        res.status(200).json({
          message: `🏓  🏓 getCountryCities OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
          result,
        });
      } catch (err) {
        Util.sendError(res, err);
      }
    });
    app
      .route("/findCitiesByLocation")
      .post(async (req: Request, res: Response) => {
        console.log(
          `\n\n💦  POST: /findCitiesByLocation requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
        );
        console.log(req.body);
        try {
          const result = await CityHelper.getCitiesByLocation(
            parseFloat(req.body.latitude),
            parseFloat(req.body.longitude),
            parseFloat(req.body.radiusInKM),
          );
          res.status(200).json({
            message: `🏓  🏓  findCitiesByLocation OK : ${new Date().toISOString()}  🔆 🔆 🔆 🔆 🔆 `,
            result,
          });
        } catch (err) {
          Util.sendError(res, err);
        }
      });
  }
}

// mongo "mongodb+srv://ar001-1xhdt.mongodb.net/ardb" --username aubs
