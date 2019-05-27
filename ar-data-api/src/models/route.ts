
import * as mongoose from "mongoose";
import { instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose } from "typegoose";

class Route extends Typegoose {

    @staticMethod
    public static findByName(this: ModelType<Route> & typeof Route, name: string) {
      console.log("#####  🥦  🥦  🥦 Finding route by name:  💦  💦  💦  :: 🥦 " + name);
      return this.findOne({ name });
    }
    @staticMethod
    public static findByAssociationName(this: ModelType<Route> & typeof Route, associationName: string) {
      console.log("#####  🥦  🥦  🥦 Finding route by associationName:  💦  💦  💦  :: 🥦 " + associationName);
      return this.findOne({ associationName });
    }
    @staticMethod
    public static findByAssociationID(this: ModelType<Route> & typeof Route, associationID: string) {
      console.log("#####  🥦  🥦  🥦 Finding route by associationID:  💦  💦  💦  :: 🥦 " + associationID);
      return this.findOne({ associationID });
    }

    @prop({required: true, index: true, trim: true})
    public name?: string;
    @prop({required: true, index: true})
    public associationID?: string;
    @prop({required: true, index: true})
    public associationName?: string;
    @prop({required: true, default: "black"})
    public color?: string;
    @prop({required: true, default: new Date().toISOString()})
    public created?: string;

    @instanceMethod
    public updateColor(this: InstanceType<Route>, color: string) {
      this.color = color;
      this.save();
    }
  }

export default Route;
