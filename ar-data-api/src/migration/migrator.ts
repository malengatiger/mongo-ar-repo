import { CollectionReference, Firestore, Query } from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import { AssociationHelper } from "../helpers/association_helper";
import { CityHelper, CountryHelper } from "./../helpers/country_helper";
const z = "\n";
console.log(
  `\n\n👺 👺 👺 🔑 Migrator: getting serviceAccount from json file  🔑 🔑...`,
);
const serviceAccount = require("../../ar.json");

const citiesJson = require("../../cities.json");
console.log(citiesJson);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌  `);
console.log(serviceAccount);
console.log(`📌 📌 📌 📌 📌 📌 📌 📌 `);
console.log(`serviceAccount: 😍 😍 😍 ...`);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aftarobot2019-dev3.firebaseio.com",
});

const fs: Firestore = admin.firestore();
console.log(`${z}💋  💋  💋  Migrator: -- firebase admin initialized;
${admin.app().name} ❤️  SDK_VERSION: ${
  admin.SDK_VERSION
}  😍 😍 😍 ${new Date().toUTCString()}`);

async function getCollections() {
  console.log(
    `\n🌸  🌸  🌸 Getting list of collections from  🌸 Firestore ...\n`,
  );
  const colRef: CollectionReference[] = await fs.listCollections();
  console.log(`${z}💦 💦 💦 💦 collections in Firestore database: \n\n`);
  colRef.forEach((m) => {
    console.log(
      `❤️  ❤️  ❤️   Firestore collection:  💦 ${m.doc().path.split("/")[0]}`,
    );
  });
  console.log(`${z}💦 💦 💦 💦 all collections listed: \n\n`);
}

getCollections();

// 5ced8952fc6e4ef1f1cfc7ae = countryID
class Migrator {
  public static async start() {
    console.log(`\n\n......Migrator is starting up ... ❤️  ❤️  ❤️  ....\n`);
    const start = new Date().getTime();

    // await this.migrateCountries();
    // await this.migrateAssociations();
    await this.migrateCities("5ced8952fc6e4ef1f1cfc7ae");

    const end = new Date().getTime();
    console.log(
      `\n\n♻️ ♻️ ♻️ ♻️ ♻️ ♻️  Migrator has finished the job:  ❤️  ${end -
        start / 1000} seconds elapsed`,
    );

    return {
      migrator: `❤️️ ❤️ ❤️   Migrator has finished the job!  ❤️  ${end -
        start / 1000} seconds elapsed  ❤️ ❤️ ❤️`,
      xdate: new Date(),
    };
  }

  public static async migrateCountries(): Promise<any> {
    console.log(`\n\n🍎  Migrating countries ........................`);
    const qs = await fs.collection("countries").get();
    console.log(`....... Firestore countries found:  🍎 ${qs.docs.length}`);

    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      const country = await CountryHelper.addCountry(
        data.name,
        data.countryCode,
      );
      this.countries.push(country);
      console.log(country);
    }
    console.log(`\n🔑 🔑 🔑   countries migrated: ${this.countries.length}`);
    for (const c of this.countries) {
      if (c.name === "South Africa") {
        console.log(c);
        await this.migrateCities(c._id);
      }
    }
  }
  public static async migrateCities(countryID: string): Promise<any> {
    console.log(`\n\n🍎 🍎 🍎  Migrating cities, countryID: ${countryID} ....... 🍎 🍎 🍎 `);
    const start = new Date().getTime();
// tslint:disable-next-line: forin
    for (const m in citiesJson) {
      const city: any = citiesJson[m];
      const x = await CityHelper.addCity(
        city.name,
        city.provinceName,
        countryID,
        "South Africa",
        city.latitude,
        city.longitude,
      );

      console.log(
        `🌳 🌳 🌳  city added to Mongo: 🍎 id: ${x._id}  🍎 ${city.name}  💛  ${
          city.provinceName
        }  📍 📍 ${city.latitude}  📍  ${city.longitude}`,
      );
    }
    const end = new Date().getTime();
    console.log(
      `\n\n💛 💛 💛 💛 💛 💛   Cities migrated: ${end -
        start / 1000} seconds elapsed`,
    );
  }
  private static countries: any = [];

  private static async migrateAssociations(): Promise<any> {
    console.log(`\n 🍎  Migrating associations .............`);
    const qs = await fs.collection("associations").get();
    console.log(`associations found:  🍎 ${qs.docs.length}`);

    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      const country = await AssociationHelper.addAssociation(
        data.name,
        data.email,
        data.email,
      );
      this.countries.push(country);
    }
    console.log(
      `🎸  🎸  🎸  associations added to Mongo: 🎀 ${qs.docs.length}`,
    );
  }
}

export default Migrator;
