import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mongobaby/ui/settings.dart';
import 'package:mongobaby/ui/slide_right.dart';
import 'package:mongobaby/ui/util.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String databaseName, collectionName, appID;
  @override
  void initState() {
    super.initState();
    _getSettings();
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
      body: Stack(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Center(
              child: ListView(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: <Widget>[
                        GestureDetector(
                            onTap: _loadCountries,
                            child: DashCard(
                              number: 0,
                              caption: 'Countries',
                              numberStyle: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 52,
                                  color: Colors.deepOrange[300]),
                            )), //countries
                        SizedBox(
                          width: 20,
                        ),
                        GestureDetector(
                          onTap: _loadCities,
                          child: DashCard(
                            number: 0,
                            caption: 'Cities',
                            numberStyle: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 52,
                                color: Colors.pink[300]),
                          ),
                        ), //cities
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: <Widget>[
                        GestureDetector(
                          onTap: _loadRoutes,
                          child: DashCard(
                            number: 0,
                            caption: 'Routes',
                            numberStyle: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 52,
                                color: Colors.teal[300]),
                          ),
                        ),
                        SizedBox(
                          width: 20,
                        ),
                        GestureDetector(
                          onTap: _loadLandmarks,
                          child: DashCard(
                            number: 0,
                            caption: 'Landmarks',
                            numberStyle: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 52,
                                color: Colors.purple[300]),
                          ),
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
                                fontSize: 52,
                                color: Colors.indigo[300]),
                          ),
                        ),
                        SizedBox(
                          width: 20,
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

  void _loadCountries() {
    debugPrint('🐼  _loadCountries  🐻 🐻 🐻');
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
        padding: const EdgeInsets.all(20.0),
        child: Container(
          width: 110,
          child: Column(
            children: <Widget>[
              Center(
                child: Text(
                  '$number',
                  style: numberStyle == null
                      ? TextStyle(fontSize: 48, fontWeight: FontWeight.w900)
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
}
