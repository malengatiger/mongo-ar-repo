import * as mongoose from "mongoose";
import Association from "../models/association";

export class AssocHelper {
  public static async addAssociation(
    name: string,
    email: string, cellphone: string,
  ): Promise<any> {
    console.log(`\n\n🌀  🌀  🌀  AssocHelper: addAssociation   🍀   ${name} -   🍀   ${cellphone}   🍀   ${email}\n`);
    const p: Association = new Association();
    p.name = name;
    p.cellphone = cellphone;
    p.email = email;

    console.log(p);
    console.log(`\n👽 👽 👽 👽  attempting MongoDB write .......... 👽 👽 👽\n`);

    const AssModel = new Association().getModelForClass(Association);
    const u = new AssModel({
            cellphone,
            email,
            name,
        });
    const m = await u.save();
    console.log(`\n\n💙  💚  💛   Yebo Gogo!!!! - MongoDB has saved an association !!!!!`);
    console.log(m);

    return p;
  }

  public static async getAssociations(): Promise<any> {
    console.log(` 🌀 getAssociations ....   🌀  🌀  🌀 `);
  }
}
