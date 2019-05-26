import express from "express";
const router = express.Router();
import * as mongoose from "mongoose";

import Association from "../models/association";

class AssociationController {
    public path = "/associations";
    public router = express.Router();
    constructor() {
        this.intializeRoutes();
    }
    public intializeRoutes() {
        console.log(`\n\nAssociationController: 👽 👽 👽 👽  intializeRoutes  🌸  🌸 `);
        this.router.get(this.path, this.getAllAssociations);
        this.router.post(this.path, this.createAssociations);
      }

      public getAllAssociations = (request: express.Request, response: express.Response) => {
          console.log(`👽 👽 👽 👽  getting all assocs 🌸  🌸 `);
          response.send({message: "🌸 🌸 🌸 all associations read"});
      }

      public createAssociations = async (request: express.Request, response: express.Response) => {
        console.log(`👽 👽 👽 👽  post request / .......... 👽 👽 👽 `);

        const AssModel = new Association().getModelForClass(Association);
        const u = new AssModel({
            cellphone: "098 366 3557",
            email: "aubrey@aftarobot",
            key: new mongoose.Types.ObjectId("Association"),
            name: "Aubrey Assoc",
        });
        const m = await u.save();
        console.log(m);
        response.send({message: "Association 👽 created"});
      }
    }

export default AssociationController;
