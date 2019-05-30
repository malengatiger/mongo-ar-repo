import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
  staticMethod,
  Typegoose,
} from "typegoose";
import Association from "./association";

class Route extends Typegoose {
  @staticMethod
  public static findByName(
    this: ModelType<Route> & typeof Route,
    name: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route(s) by name:  💦  💦  💦  :: 🥦 " + name,
    );
    return this.findOne({ name });
    // coulf be list, routes can have same or similar names for each association
  }
  //
  @staticMethod
  public static findByAssociationName(
    this: ModelType<Route> & typeof Route,
    associationName: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route by associationName:  💦  💦  💦  :: 🥦 " +
        associationName,
    );
    return this.findOne({ associationName });
  }
  //
  @staticMethod
  public static findByAssociationID(
    this: ModelType<Route> & typeof Route,
    associationID: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route by associationID:  💦  💦  💦  :: 🥦 " +
        associationID,
    );
    return this.findOne({ associationID });
  }
  //
  @prop({ index: true, trim: true })
  public name?: string;
  //
  @prop({ required: true })
  public associations?: any[];
  //
  @prop({ required: true, default: "black" })
  public color?: string;
  //
  @prop({ default: [] })
  public rawRoutePoints?: any[];
  @prop({ default: [] })
  public routePoints?: any[];
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //
  @instanceMethod
  public updateColor(this: InstanceType<Route>, color: string) {
    this.color = color;
    this.save();
  }
  //
  @instanceMethod
  public addAssociation(this: InstanceType<Route>, association: any) {
    if (!this.associations) {
      this.associations = [];
    }
    this.associations.push(association);
    this.save();
  }
}

export default Route;
