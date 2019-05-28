
import * as mongoose from "mongoose";
import { instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose } from "typegoose";

class Association extends Typegoose {

    @staticMethod
    public static findByName(this: ModelType<Association> & typeof Association, name: string) {
      console.log("#####  🥦  🥦  🥦 Finding association by name:  💦  💦  💦  :: 🥦 " + name);
      return this.findOne({ name });
    }

    @prop({required: true, index: true, unique: true, trim: true})
    public name?: string;
    @prop()
    public email?: string;
    @prop()
    public cellphone?: string;
    @prop({required: true, default: new Date().toISOString()})
    public created?: string;

    @instanceMethod
    public updateEmail(this: InstanceType<Association>, email: string) {
      this.email = email;
      this.save();
    }
    @instanceMethod
    public updateCellphone(this: InstanceType<Association>, cellphone: string) {
      this.cellphone = cellphone;
      this.save();
    }
  }

export default Association;
