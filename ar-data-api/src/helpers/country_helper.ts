import City from "../models/city";
import Country from "../models/Country";

export class CountryHelper {
  public static async onCountryAdded(event: any) {
    console.log(`Country event has occured ....`);
    console.log(event);
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  Country in stream:   🍀   🍀  ${event.fullDocument.name} 🍎
      _id: ${event.fullDocument._id} 🍎 `,
    );
  }
  public static async addCountry(
    name: string,
    countryCode: string,
  ): Promise<any> {
    console.log(
      `\n\n🌀  🌀  🌀  CountryHelper: addCountry   🍀   ${name}   🍀 \n`,
    );

    const CountryModel = new Country().getModelForClass(Country);
    const u = new CountryModel({
      countryCode,
      name,
    });
    const m = await u.save();
    return m;
  }

  public static async getCountries(): Promise<any> {
    console.log(` 🌀 getCountries ....   🌀  🌀  🌀 `);
    const CountryModel = new Country().getModelForClass(Country);
    const list = await CountryModel.find();
    return list;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CityHelper {
  public static async onCityAdded(event: any) {
    console.log(`City event has occured ....`);
    console.log(event);
    // tslint:disable-next-line: max-line-length
    console.log(
      `operationType: 👽 👽 👽  ${
        event.operationType
      },  City in stream:   🍀   🍀  ${event.fullDocument.name} 🍎  _id: ${
        event.fullDocument._id
      } 🍎 `,
    );
  }
  public static async addCity(
    name: string,
    provinceName: string,
    countryID: string,
    countryName: string,
    latitude: number,
    longitude: number,
  ): Promise<any> {
    const cityModel = new City().getModelForClass(City);
    const position = {
      coordinates: [longitude, latitude],
      type: "Point",
    };
    const u = new cityModel({
      countryID,
      countryName,
      latitude,
      longitude,
      name,
      position,
      provinceName,
    });
    const m = await u.save();
    console.log(`\n\n🌀  🌀  🌀  CityHelper: city added:   🍀   ${name} \n`);

    return m;
  }

  public static async getCities(countryID: string): Promise<any> {
    console.log(`\n🌀 getCities ....   🌀  🌀  🌀 `);
    const CityModel = new City().getModelForClass(City);
    const list = await CityModel.find({ countryID });
    return list;
  }
  public static async getCitiesByLocation(
    latitude: number,
    longitude: number,
    radiusInKM: number,
  ): Promise<any> {
    console.log(`\n🌀 🌳 🌳 🌳  getCitiesByLocation ....  lat: ${latitude}  lng: ${longitude} 🌀 🌀 🌀\n`);
    const CityModel = new City().getModelForClass(City);

    const mList = await CityModel.find({
      position: {
        $near: {
          $geometry: { coordinates: [longitude, latitude], type: "Point" },
          $maxDistance: radiusInKM * 1000,
        },
      },
    });
    console.log(`\n\n🍎 🍎 🍎 Cities found within: 🍎 ${radiusInKM * 1000} metres:  🌳 🌳 🌳 ${mList.length} cities`);
    let cnt = 0;
    mList.forEach((m: any) => {
      cnt++;
      console.log(`🍏 🍏  #${cnt} - ${m.name}  🔆  ${m.provinceName}  💙  ${m.countryName}`);
    });
    return mList;
  }
}
