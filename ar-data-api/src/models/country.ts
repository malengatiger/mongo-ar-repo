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

class Country extends Typegoose {
  @staticMethod
  public static findByName(
    this: ModelType<Country> & typeof Country,
    name: string,
  ) {
    console.log(
      "#####  🥦  🥦  🥦 Finding route(s) by name:  💦  💦  💦  :: 🥦 " + name
    );
    return this.findOne({ name });
    // coulf be list, routes can have same or similar names for each association
  }
  //
  @prop({ required: true, index: true, trim: true, unique: true })
  public name?: string;

  @prop({ required: true, default: "ZA" })
  public countryCode?: string;

  @prop({ required: true, unique: true, index: true, trim: true })
  public countryID?: string;
  //
  @prop({ required: true, default: new Date().toISOString() })
  public created?: string;
  //

}

export default Country;
