import { Request, Response } from "express";
import { AssociationHelper } from "../helpers/association_helper";
import { RouteHelper } from "../helpers/route_helper";

export class AssociationExpressRoutes {
  public routes(app): void {
    console.log(
      `\n\n🏓 🏓 🏓 🏓 🏓    AssociationExpressRoutes:  💙  setting up default assoc route ...`,
    );

    app.route("/addAssociation").post(async (req: Request, res: Response) => {
      console.log(
        `\n\n💦  POST: /associations requested .... 💦 💦 💦 💦 💦 💦  ${new Date().toISOString()}`,
      );
      console.log(req.body);
      try {
        const result = await AssociationHelper.addAssociation(
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
export default AssociationExpressRoutes;
