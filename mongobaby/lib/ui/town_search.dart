import 'package:aftarobotlibrary4/api/loader_bloc.dart';
import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
as bg;

import 'landmark_search.dart';

class TownSearch extends StatefulWidget {
  @override
  _TownSearchState createState() => _TownSearchState();
}

class _TownSearchState extends State<TownSearch> {
  GlobalKey<ScaffoldState> _key = GlobalKey();
  bg.Location _location;
  List<CityDTO> _cities = List();
  bool isBusy = false;
  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  void _getCurrentLocation() async {
    setState(() {
      isBusy = true;
    });
    _location = await loaderBloc.getCurrentLocation();
    _startSearch();
  }

  void _startSearch() async {
    debugPrint('💚 💚 searching for cities in Atlas database  🔴 ');
    var start = DateTime.now();
    setState(() {
      isBusy = true;
    });
    _cities = await loaderBloc.findCitiesByLocation(
      latitude: _location.coords.latitude,
      longitude: _location.coords.longitude,
      radiusInKM: radius,
    );
    var end = DateTime.now();
    var m = end.difference(start).inMilliseconds;
    setState(() {
      isBusy = false;
      count = _cities.length;
      elapsed = '$m milliseconds elapsed for search';
      message = 'Search for towns completed';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Town/City/Place Search'),
        backgroundColor: Colors.teal[400],
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _getCurrentLocation,
          ),
        ],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(280),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Expanded(
                      child: Container(
                        child: Text(
                          'Use Atlas database to search for places using current location. Check for speed and accuracy!'
                          , style: Styles.whiteSmall,),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 12,
                ),
                Text(_location == null? '': '${_location.coords.latitude}, ${_location.coords.longitude}',
                  style: Styles.blackBoldMedium,),
                SizedBox(
                  height: 12,
                ),
                Results(
                  count: count,
                  message: message,
                  elapsed: elapsed,
                ),
                SizedBox(
                  height: 12,
                ),
                Container(
                  color: Colors.white,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      SizedBox(width: 4,),
                      Text('$radius', style: Styles.pinkBoldMedium,),
                      SizedBox(width: 4,),
                      Text('km'),
                      SizedBox(width: 24,),
                      Slider(
                        value: radius,
                        min: 2,
                        max: 40,
                        onChanged: _onSliderChanged,
                        divisions: 4,
                        onChangeEnd: _onSliderChangeEnded,
                      ),

                      SizedBox(width: 8,),
                      IconButton(icon: Icon(Icons.done),
                        onPressed: () {
                          _startSearch();
                        },),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.brown[50],
      body: Stack(
        children: <Widget>[
          isBusy? Center(child: BusyCard(
            indicatorColor: Colors.red[700],
            cardColor: Colors.teal[50],
          )) : Container(),
          isBusy? Container() : ListView.builder(
            itemCount: _cities.length,
            itemBuilder: (BuildContext context, int index) {
              return Padding(
                padding: const EdgeInsets.only(left:8.0, right: 8),
                child: Card(
                  elevation: 2,
                  child: ListTile(
                    title: Text(_cities.elementAt(index).name),
                    subtitle: Text('${_cities.elementAt(index).distance}'),
                    leading: Icon(Icons.airline_seat_flat_angled, color: Colors.grey[300],),
                    onTap: () {
                      debugPrint('🔴🔴 city tapped: 💚 ${_cities.elementAt(index).name} 💚 ${_cities.elementAt(index).cityID} ');
                    },),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
  int count = 0;
  String message ="", elapsed = "";
  double radius = 2;

  void _onSliderChanged(double value) {
    print('💚 💚 slider changed radius of search to:  🔴 $value km');
    setState(() {
      radius = value;
    });
  }

  void _onSliderChangeEnded(double value) {
    print('🔵 🔵 🔵  _onSliderChangeEnded: changed radius of search to:  🔴 $value km,  🐥  🐥  🐥 starting search');
    setState(() {
      radius = value;
    });
    _startSearch();
  }
}


