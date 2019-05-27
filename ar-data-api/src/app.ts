import * as bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as morgan from "morgan";
const app = express();
const mPort = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/ardb?retryWrites=true`;
import { Routes } from "./routes/app_routes";

mongoose
  .connect(mongoConnection, {
    useNewUrlParser: true,
  })
  .then((client) => {
    console.log(client);
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
        // tslint:disable-next-line: max-line-length
        console.log(
          `operationType: 👽 👽 👽  ${
            event.operationType
          },  route in stream:   🍀   🍀  ${
            event.fullDocument.name
          } 🍎  _id: ${event.fullDocument._id} 🍎 `,
        );
        console.log(
          `\n👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 👽 Happiness Two, Houston!! 👽 👽 👽\n\n`,
        );
      });
  })
  .catch((err) => {
    console.error(err);
  });
console.log(`\n\Mongoose connected ... 🔆 🔆 🔆 🔆 🔆`);

// function loggerMiddleware(request: express.Request, response: express.Response, next) {
//     console.log(`🔆 🔆 request method: 🍎  ${request.method} path: 🍎  ${request.path}`);
//     next();
//   }

class App {
  public app: express.Application;
  public port: number;
  public routes: Routes = new Routes();

  constructor() {
    console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   Inside App constructor `);
    this.app = express();
    this.port = 5000;
    this.initializeMiddlewares();
    this.routes.routes(this.app);
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

export default App;
