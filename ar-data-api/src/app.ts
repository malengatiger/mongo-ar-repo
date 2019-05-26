import * as bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as morgan from "morgan";
const app = express();
const mPort = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD || "aubrey3";
const user = process.env.MONGODB_USER || "aubs";
const appName = "AR MongoDB API";
const mongoConnection = `mongodb+srv://${user}:${password}@ar001-1xhdt.mongodb.net/test?retryWrites=true`;
import AssociationController from "./routes/associations";

mongoose.connect(
    mongoConnection, {
        useNewUrlParser: true,
    });
console.log(`\n\Mongoose connected ... 🔆 🔆 🔆 🔆 🔆`);
function loggerMiddleware(request: express.Request, response: express.Response, next) {
    console.log(`🔆 🔆 request method: 🍎  ${request.method} path: 🍎  ${request.path}`);
    next();
  }
// app.use(loggerMiddleware);
// app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.send("The sedulous hyena ate the antelope!");
// });

// app.listen(port, () => {
//     console.log(`♻️ ♻️ ♻️ mongoDB connection:  ♻️  ${mongoConnection}  ♻️`);
//     return console.log(`🏮 🏮 🏮  Server is listening on ${port} for app: 💚 💙 💜  ${appName} :  🍎  ${new Date()}`);
// });
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );
// });

// app.use("/associations", AssociationController.call("");

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: any, port: number) {
        console.log(`\n\n🦀 🦀 🦀 🦀 🦀    ---   Inside App constructor `);
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen() {
      this.app.listen(this.port, () => {
        console.log(`\n\n🥦 🥦 🥦 🥦   ---   App listening on port 🥦  💦  ${this.port}  💦`);
      });
    }

    private initializeMiddlewares() {
        console.log(`\n🥦 🥦  initializeMiddlewares`);
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        console.log(`\n🥦 🥦  initializeControllers`);
        controllers.forEach((controller: AssociationController) => {
        console.log(controller);
        this.app.use(controller.path, controller.router);
      });
    }
  }

export default App;
