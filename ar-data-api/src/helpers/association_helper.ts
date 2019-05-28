import * as mongoose from "mongoose";
import Association from "../models/association";

export class AssociationHelper {
  public static async addAssociation(
    name: string,
    email: string,
    cellphone: string,
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  🌀  AssocHelper: addAssociation   🍀   ${name} -   🍀   ${cellphone}   🍀   ${email}\n`
    );
    console.log(
      // tslint:disable-next-line: max-line-length
      `\n👽 👽 👽 👽  AssocHelper: attempting MongoDB write using Typegoose  🍎  getModelForClass  .......... 👽 👽 👽\n`
    );

    const associationModel = new Association().getModelForClass(Association);
    const u = new associationModel({
      cellphone,
      email,
      name,
    });
    const m = await u.save();
    console.log(
      `\n\n💙  💚  💛   AssocHelper: Yebo Gogo!!!! - MongoDB has saved ${name} !!!!!  💙  💚  💛`
    );

    const ass = await associationModel.findByName(
      "MongoDataX Taxi Association",
    );
    console.log(`💛 💛 💛 💛  Association found in Mofo: 💚  ${ass}`);
    console.log(ass);
    console.log(
      `🏓  db: ${m.db.db.databaseName} 💛 💛 collection: ${
        m.collection.collectionName
      } 💙 💙  id: ${m.id}`,
    );

    return m;
  }

  public static async getAssociations(): Promise<any> {
    console.log(` 🌀 getAssociations ....   🌀  🌀  🌀 `);
  }
}
