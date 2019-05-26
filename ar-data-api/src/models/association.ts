
import * as mongoose from "mongoose";
import { InstanceType, ModelType, prop, Typegoose } from "typegoose";

class Association extends Typegoose {
    @prop()
    public name?: string;
    @prop()
    public email?: string;
    @prop()
    public cellphone?: string;
  }

export default Association;
