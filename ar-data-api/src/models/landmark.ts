import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
// tslint:disable-next-line: ordered-imports
  staticMethod,
  Typegoose,
} from "typegoose";
import Association from "./association";
import Route from "./route";

class Landmark extends Typegoose {
  @staticMethod
  public static findByName(
    this: ModelType<Landmark> & typeof Landmark,
    name: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by name:  💦  💦  💦  :: 🥦 " + name,
    );
    return this.findOne({ name });
    // could be list, routes can have same or similar names for each association
  }
  //
  @staticMethod
  public static findByRouteName(
    this: ModelType<Landmark> & typeof Landmark,
    routeName: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by associationName:  💦  💦  💦  :: 🥦 " +
        routeName,
    );
    return this.findOne({ associationName: routeName });
  }
  //
  @staticMethod
  public static findByRouteID(
    this: ModelType<Landmark> & typeof Landmark,
    routeID: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by associationID:  💦  💦  💦  :: 🥦 " +
        routeID,
    );
    return this.findOne({ associationID: routeID });
  }
  //
  @staticMethod
  public static findByAssociationName(
    this: ModelType<Landmark> & typeof Landmark,
    associationName: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding landmark by associationName:  💦  💦  💦  :: 🥦 " +
        associationName,
    );
    return this.findOne({ associationName });
  }
  //
  @staticMethod
  public static findByAssociationID(
    this: ModelType<Landmark> & typeof Landmark,
    associationID: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route by associationID:  💦  💦  💦  :: 🥦 " +
        associationID,
    );
    return this.findOne({ associationID });
  }
  //
  @prop({ required: true, trim: true })
  public landmarkName?: string;

  @prop({ required: true })
  public position?: any;
  //
  @arrayProp({ items: Route, default: [] })
  public routes?: Route[];
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //
  @instanceMethod
  public addRoute(this: InstanceType<Landmark>, route: Route) {
    if (!this.routes) {
      this.routes = [];
    }
    this.routes.push(route);
    this.save();
  }

  @instanceMethod
  public updateLocation(this: InstanceType<Landmark>, id: string, latitude: number, longitude: number) {
    this.position = {
      coordinates: [longitude, latitude],
      type: "Point",
    };
    this.save();
  }

}

export default Landmark;
