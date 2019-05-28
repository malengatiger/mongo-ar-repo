import * as bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as morgan from "morgan";
import { RouteHelper } from "./helpers/route_helper";
import {  AppExpressRoutes } from "./routes/app_routes";
import { LandmarkExpressRoutes } from "./routes/landmark_routes";
const app = express();
const mPort = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
import AssociationExpressRoutes from "./routes/assoc_routes";
import { RouteExpressRoutes } from "./routes/route_routes";

let mongoClient;
console.log(`\n\n\n🧡 💛   AftaRobot MongoDB API ... ☘️  starting  ☘️  ${new Date().toISOString()}   🧡 💛\n`);
mongoose
  .connect(mongoConnection, {
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log(client);
    mongoClient = client;
    const collection = client.connection.collection("associations");
    const collection2 = client.connection.collection("routes");
    console.log(
      `🔆 🔆 🔆  creating stream ... and watching ... 👽 👽 👽 ${
        collection.collectionName
      }  👽 👽 👽 ${collection2.collectionName}`,
    );
    const stream = collection.watch();
    const stream2 = collection2.watch();
    stream.on("change", (event) => {
      console.log(`\n🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆  🍎  stream onChange fired!  🍎  🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆`);

      // tslint:disable-next-line: max-line-length
      console.log(
        `operationType: 👽 👽 👽  ${
          event.operationType
        },  association in stream:   🍀   🍀  ${
          event.fullDocument.name
        } 🍎  _id: ${event.fullDocument._id} 🍎 `,
      );
      console.log(
        `\n👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 Happiness One, Houston!! 👽 👽 👽\n\n`,
      );
    });
    stream2.on("change", (event) => {
        console.log(`\n🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆  🍎  stream2 onChange fired!  🍎  🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆 🔆`);
        RouteHelper.onRouteAdded(event);
      });
  })
  .catch((err) => {
    console.error(err);
  });
console.log(`\nMongoose connected ... 🔆 🔆 🔆 🔆 🔆`);

// function loggerMiddleware(request: express.Request, response: express.Response, next) {
//     console.log(`🔆 🔆 request method: 🍎  ${request.method} path: 🍎  ${request.path}`);
//     next();
//   }

class AftaRobotApp {
  public app: express.Application;
  public port: number;
  public landmarkRoutes: LandmarkExpressRoutes = new LandmarkExpressRoutes();
  public routeRoutes: RouteExpressRoutes = new RouteExpressRoutes();
  public associationRoutes: AssociationExpressRoutes = new AssociationExpressRoutes();
  public appRoutes: AppExpressRoutes = new AppExpressRoutes();

  constructor() {
    console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   Inside App constructor `);
    this.app = express();
    this.port = 5000;
    this.initializeMiddlewares();
    this.landmarkRoutes.routes(this.app);
    this.routeRoutes.routes(this.app);
    this.associationRoutes.routes(this.app);
    this.appRoutes.routes(this.app);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `\n\n🥦 🥦 🥦 🥦   ---   AR MongoDB API listening on port 🥦  💦  ${
          this.port
        }  💦`,
      );
    });
  }

  private initializeMiddlewares() {
    console.log(`\n🥦 🥦  initializeMiddleware .... `);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default AftaRobotApp;
