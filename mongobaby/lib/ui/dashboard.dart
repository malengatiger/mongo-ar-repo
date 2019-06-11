import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/countrydto.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/data/routedto.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:aftarobotlibrary4/api/loader_bloc.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mongobaby/ui/city_loader.dart';
import 'package:mongobaby/ui/settings.dart';
import 'package:mongobaby/ui/slide_right.dart';
import 'package:mongobaby/ui/town_search.dart';
import 'package:mongobaby/ui/util.dart';

import 'landmark_search.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String databaseName, collectionName, appID;
  @override
  void initState() {
    super.initState();
    _buildNavItems();
    _getSettings();
    _getCountries();
    _getSavedCountry();
    _getRoutes();
    _getLandmarks();

  }
  _getSavedCountry()  async {
    print('_getSavedCountry  😡😡😡😡😡😡  ...........................');
    country = await Prefs.getCountry();
    if (country != null)  {
      debugPrint(' 🧩 🧩 🧩 🧩 Getting local cities for 😡  ${country.name} ...');
      loaderBloc.getLocalCities(countryID: country.countryID);
    }
  }
  Future _getCountries() async {
    countries = await loaderBloc.getLocalCountries();
    if (countries.isEmpty) {
      await loaderBloc.getRemoteCountriesAndLoad();
    }
  }
  List<RouteDTO> routes = List();
  List<LandmarkDTO> landmarks = List();

  Future _getRoutes() async {
    routes = await loaderBloc.getLocalRoutes();
    if (routes.isEmpty) {
      await loaderBloc.getRemoteRoutesAndLoad();
    }
  }
  Future _getLandmarks() async {
    landmarks = await loaderBloc.getLocalLandmarks();
    if (landmarks.isEmpty) {
      await loaderBloc.getRemoteLandmarksAndLoad();
    }
  }
  void _getSettings() async {
    appID = await getAppID();
    databaseName = await getDatabaseName();
    collectionName = await getCollectionName();
    if (appID == null) {
      _navigateToSettings();
    } else {
      print(
          '🍏 🍎 appID: $appID 🍏 🍎 databaseName: $databaseName 🍏 🍎 collectionName: $collectionName');
    }
    setState(() {});
  }

  void _navigateToSettings() {
    SlideRightRoute(
      widget: Settings(),
    );
  }

  GlobalKey<ScaffoldState> _key = GlobalKey();
  List<BottomNavigationBarItem> navItems = List();
  int numCountries = 0, numCities = 0, numRoutes = 0, numLandmarks = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text(
          'Mobile Data Loader',
          style: Styles.whiteBoldMedium,
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(80),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              children: <Widget>[
                Text(
                  'This app loads data from MongoDB (Atlas) in the cloud to the local, on-device database  (MongoDB Mobile). This will help with user data costs.',
                  style: Styles.whiteSmall,
                )
              ],
            ),
          ),
        ),
        actions: <Widget>[
          IconButton(icon: Icon(Icons.refresh), onPressed: _refresh,),
        ],
      ),
      backgroundColor: Colors.brown[50],
      bottomNavigationBar: navItems.length > 1? BottomNavigationBar(
        items: navItems,
        key: Key('navBar'),
        elevation: 8,
        onTap: _onNavTapped,
      ) : Container(),
      body: Stack(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Center(
              child: ListView(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: <Widget>[
                        StreamBuilder<List<CountryDTO>>(
                          stream: loaderBloc.countryStream,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              numCountries = snapshot.data.length;
                            }
                            return GestureDetector(
                                onTap: _loadCountries,
                                child: DashCard(
                                  number: numCountries,
                                  caption: 'Countries',
                                  numberStyle: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 28,
                                      color: Colors.deepOrange[300]),
                                ));
                          }
                        ), //countries
                        SizedBox(
                          width: 8,
                        ),
                        StreamBuilder<List<CityDTO>>(
                          stream: loaderBloc.cityStream,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              numCities = snapshot.data.length;
                            }
                            return GestureDetector(
                              onTap: ()  {
                                print('cities onTap: 👽 👽 👽 👽 👽 👽 👽 👽 ');
                                _checkCities();
                              },
                              child: DashCard(
                                number: numCities,
                                caption: 'Cities',
                                numberStyle: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 28,
                                    color: Colors.blue[300]),
                              ),
                            );
                          }
                        ), //cities
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: <Widget>[
                        StreamBuilder<List<RouteDTO>>(
                          stream: loaderBloc.routeStream,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              numRoutes = snapshot.data.length;
                            }
                            return GestureDetector(
                              onTap: _loadRoutes,
                              child: DashCard(
                                number: numRoutes,
                                caption: 'Routes',
                                numberStyle: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 28,
                                    color: Colors.teal[300]),
                              ),
                            );
                          }
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        StreamBuilder<List<LandmarkDTO>>(
                          stream: loaderBloc.landmarkStream,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              numLandmarks = snapshot.data.length;
                            }
                            return GestureDetector(
                              onTap: _loadLandmarks,
                              child: DashCard(
                                number: numLandmarks,
                                caption: 'Landmarks',
                                numberStyle: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 28,
                                    color: Colors.purple[300]),
                              ),
                            );
                          }
                        ), //landmarks
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: <Widget>[
                        GestureDetector(
                          onTap: _loadVehicles,
                          child: DashCard(
                            number: 0,
                            caption: 'Vehicles',
                            numberStyle: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 28,
                                color: Colors.indigo[300]),
                          ),
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Card(), //cities
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }


  CountryDTO country;
  void _checkCities() async {
    print('👽 👽 👽 checking country, then getting cities');
    country = await Prefs.getCountry();
    if  (country != null) {
      print('country  ${country.name} in cache ... get cities');
      var list = await loaderBloc.getLocalCities(countryID: country.countryID);
      print('😡 ${list.length}  😡 😡 😡  cities found');
    }  else {
      print('👽 country NOT in cache ...');
    }
  }
  void _loadCountries() async {
    debugPrint('🐼  _loadCountries  🐻 🐻 🐻');
    if (countries.isEmpty) {
      await _getCountries();
    }
    mPrint('🌀 🌀 🌀 🌀 navigate to .... 🔴 start CityLoader');
    Navigator.push(context, SlideRightRoute(widget: CityLoader(countries: countries,)));

  }

  void _loadCities() {
    debugPrint('😡  _loadCities 😡 😡 😡 ');
  }

  void _loadRoutes() {
    debugPrint('🌼 ☘ _loadRoutes  ☘');
  }

  void _loadLandmarks() {
    debugPrint('🤖 🤖  _loadLandmarks  🤖 ');
  }

  void _loadVehicles() {
    debugPrint('🌼 🌼 _loadVehicles 🚗  🚗  🚗 ');
  }

  void _refresh() {
    debugPrint('🏈  🏈  🏈  refresh data from local DB ...  🏈  🏈  🏈 ');
  }
  List<CountryDTO> countries = List();


  void _buildNavItems() {
    navItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.location_city),
      title: Text('Towns'),
    ));
    navItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.airport_shuttle),
      title: Text('Vehicles'),
    ));
    navItems.add(BottomNavigationBarItem(
      icon: Icon(Icons.location_on),
      title: Text('Landmarks'),
    ));
    setState(() {

    });
  }
  void _onNavTapped(int value) {
    print('_onNavTapped, value: $value');
    switch (value) {
      case 0:
        Navigator.push(context, SlideRightRoute(
          widget: TownSearch(),
        ));
        break;
      case 1:
//        Navigator.push(context, SlideRightRoute(
//          widget: VehicleSearch(),
//        ));
        break;
      case 2:
        Navigator.push(context, SlideRightRoute(
          widget: LandmarkSearch(),
        ));
        break;
    }
  }
}


class DashCard extends StatelessWidget {
  final String caption;
  final int number;
  final TextStyle captionStyle, numberStyle;

  DashCard(
      {@required this.number,
      @required this.caption,
      this.captionStyle,
      this.numberStyle});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: getRandomPastelColor(),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Container(
          width: 148,
          child: Column(
            children: <Widget>[
              Center(
                child: Text(
                  _format(number),
                  style: numberStyle == null
                      ? TextStyle(fontSize: 28, fontWeight: FontWeight.w900)
                      : numberStyle,
                ),
              ),
              SizedBox(
                height: 20,
              ),
              Center(
                child: Text(
                  caption,
                  style: captionStyle == null
                      ? TextStyle(fontSize: 14, fontWeight: FontWeight.w900)
                      : captionStyle,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  String _format(int number) {
    final formatter = new NumberFormat("#,###");
    return formatter.format(number);
  }
}
