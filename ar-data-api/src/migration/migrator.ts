import { CollectionReference, Firestore, Query } from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import { AssociationHelper } from "../helpers/association_helper";
import { RouteHelper } from "../helpers/route_helper";
import { VehicleHelper } from "../helpers/vehicle_helper";
import { CommuterRequestHelper } from "./../helpers/commuter_request_helper";
import { CityHelper, CountryHelper } from "./../helpers/country_helper";
import { LandmarkHelper } from "./../helpers/landmark_helper";
const z = "\n";
console.log(
  `\n\n👺 👺 👺 🔑 Migrator: getting serviceAccount from json file  🔑 🔑...`,
);
// tslint:disable-next-line: no-var-requires
const serviceAccount = require("../../ar.json");

// tslint:disable-next-line: no-var-requires
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
// TODO - ♻️ ♻️ build route point migration : May 30, 2019
// TODO - 🌸 🌸 migrate the rest of Firestore database -  🌸  🌸  🌸
class Migrator {
  public static async start() {
    console.log(`\n\n......Migrator is starting up ... ❤️  ❤️  ❤️  ....\n`);
    const start = new Date().getTime();

    // await this.migrateCountries();
    // await this.migrateAssociations();
    // await this.migrateCities("5ced8952fc6e4ef1f1cfc7ae");
    // await this.migrateVehicleTypes();
    // await this.migrateVehicles();
    // await this.migrateRoutes();
    await this.migrateCommuterRequests();

    const end = new Date().getTime();
    console.log(
      `\n\n♻️ ♻️ ♻️ ♻️ ♻️ ♻️  Migrator has finished the job:  ❤️  ${(end -
        start) /
        1000} seconds elapsed\n\n`,
    );

    return {
      migrator: `❤️️ ❤️ ❤️   Migrator has finished the job!  ❤️  ${(end -
        start) /
        1000} seconds elapsed  ❤️ ❤️ ❤️`,
      xdate: new Date(),
    };
  }

  public static async migrateCommuterRequests(): Promise<any> {
    console.log(`\n\n🍎  Migrating commuter requests ........................`);
    const qs = await fs.collection("commuterRequests").get();
    console.log(
      `....... Firestore commuterRequests found:  🍎 ${qs.docs.length}`,
    );

    let cnt  = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      cnt++;

      if (data.fromLandmarkId && data.routeId) {
        const cr = await CommuterRequestHelper.addCommuterRequest(data);
        console.log(` 🍀 🍀 🍀 #${cnt} commuter request migrated:  🍀 ${cr.createdAt}`);
      } else {
        console.log(`👿 some data missing, #${cnt} 👿👿👿 IGNORED`);
      }

    }
    console.log(
      `\n🔑 🔑 🔑   commuterRequests migrated:  🍀  ${qs.docs.length}  🍀`,
    );
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
    console.log(
      `\n\n🍎 🍎 🍎  Migrating cities, countryID: ${countryID} ....... 🍎 🍎 🍎 `,
    );
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
  public static async migrateAssociations(): Promise<any> {
    console.log(`\n\n🍎  Migrating associations .............`);
    const qs = await fs.collection("associations").get();
    console.log(`associations found:  🍎  ${qs.docs.length}`);

    const countryID = "5ced8952fc6e4ef1f1cfc7ae";
    const countryName = "South Africa";
    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      await AssociationHelper.addAssociation(
        data.associationName,
        "info@association.com",
        data.phone,
        countryID,
        countryName,
      );
      cnt++;
    }
    console.log(`\n🎸  🎸  🎸  associations added to Mongo: 🎀 ${cnt}`);
  }
  public static async migrateVehicles(): Promise<any> {
    console.log(`\n\n🍎  Migrating vehicles ............. 🍎🍎🍎`);
    const qs = await fs.collection("vehicles").get();
    console.log(`🍎  Firestore vehicles found:  🍎  ${qs.docs.length}`);

    // get assocs from mongo
    const assocs: any = await AssociationHelper.getAssociations();
    console.log(`👽 👽 ${assocs.length} Associations from Mongo`);

    const vehicleTypeID = "5cee5f3bc8a7cd3ee8598e43";
    let cnt = 0;
    for (const doc of qs.docs) {
      const vehicle: any = doc.data();
      console.log(vehicle);
      for (const association of assocs) {
        if (association.name === vehicle.associationName) {
          await VehicleHelper.addVehicle(
            vehicle.vehicleReg,
            association.id,
            association.name,
            null,
            vehicle.ownerName,
            vehicleTypeID,
            [
              "photo1.somewhere.com storage url",
              "photo2.somewhere.com storage url",
            ],
          );
          cnt++;
        }
      }
    }
    console.log(`\n🎸  🎸  🎸  vehicles migrated to Mongo: 🎀 ${cnt} \n\n`);
  }
  public static async migrateVehicleTypes(): Promise<any> {
    console.log(`\n\n🍎  Migrating vehicleTypess .............`);
    const qs = await fs.collection("vehicleTypes").get();
    console.log(`vehicleTypes found:  🍎  ${qs.docs.length}`);

    const countryID = "5ced8952fc6e4ef1f1cfc7ae";
    const countryName = "South Africa";
    let cnt = 0;
    for (const doc of qs.docs) {
      const data: any = doc.data();
      console.log(data);
      await VehicleHelper.addVehicleType(
        data.make,
        data.model,
        data.capacity,
        countryID,
        countryName,
      );
      cnt++;
    }
    console.log(`\n🎸  🎸  🎸  vehicleTypes added to Mongo: 🎀 ${cnt}`);
  }
  public static async migrateRoutes(): Promise<any> {
    console.log(`\n\n🍎  Migrating routes ............. 🍎🍎🍎\n\n`);

    const s = new Date().getTime();
    const routesQuerySnap = await fs.collection("routes").get();
    console.log(
      `🍎  Firestore routes found:  🍎  ${routesQuerySnap.docs.length}`,
    );
    const landmarksQuerySnap = await fs.collection("landmarks").get();
    console.log(
      `🍎  Firestore landmarks found:  🍎  ${landmarksQuerySnap.docs.length}`,
    );

    // get assocs from mongo
    const assocs: any = await AssociationHelper.getAssociations();
    console.log(
      `\n👽 👽 👽 👽 👽 👽 👽 👽  ${
        assocs.length
      } Associations from Mongo 💛 💛\n\n`,
    );

    let cnt = 0;
    const cnt2 = 0;
    for (const doc of routesQuerySnap.docs) {
      const route: any = doc.data();
      for (const association of assocs) {
        if (association.name === route.associationName) {
          const mRoute = await RouteHelper.addRoute(
            route.name,
            [association.id],
            route.color,
          );
          cnt++;
          console.log(`\n💛 💛 💛  Migrator: route added  💛 ${mRoute.name}`);
          // get all route landmarks by name and migrate
          console.log(mRoute);
          this.processRouteLandmarks(mRoute, landmarksQuerySnap);
        }
      }
    }
    const e = new Date().getTime();
    const elapsed = `\n🎁 🎁 🎁  Migration took ${(e - s) /
      100} elapsed seconds 🎁 🎁 🎁`;
    console.log(`\n🎸  🎸  🎸  routes migrated to Mongo: 🎀  \n`);
    console.log(`\n🎸  🎸  🎸  landmarks migrated to Mongo: 🎀  \n\n`);

    console.log(elapsed);
  }
  private static countries: any = [];
  private static async processRouteLandmarks(mRoute, landmarksQuerySnap) {
    console.log(
      `\n\nroute ....... about to loop thru landmarks ... 😍 ${mRoute.name}`,
    );

    const landmarks: any = [];
    for (const mdoc of landmarksQuerySnap.docs) {
      if (mRoute.name === mdoc.data().routeName) {
        landmarks.push({
          landmarkName: mdoc.data().landmarkName,
          latitude: mdoc.data().latitude,
          longitude: mdoc.data().longitude,
        });
      }
    }
    console.log(`\nsending 🎀 🎀 ${landmarks.length} landmarks to batch`);
    await LandmarkHelper.addLandmarks(landmarks, mRoute.id);
  }
}

export default Migrator;
