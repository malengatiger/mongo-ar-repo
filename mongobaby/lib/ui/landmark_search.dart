import 'package:aftarobotlibrary4/api/loader_bloc.dart';
import 'package:aftarobotlibrary4/data/landmarkdto.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;

class LandmarkSearch extends StatefulWidget {
  @override
  _LandmarkSearchState createState() => _LandmarkSearchState();
}

class _LandmarkSearchState extends State<LandmarkSearch> {
  GlobalKey<ScaffoldState> _key = GlobalKey();
  bg.Location _location;
  List<LandmarkDTO> _landmarks = List();
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
    debugPrint('💚 💚 searching for landmarks in local database  🔴 ');
    var start = DateTime.now();
    setState(() {
      isBusy = true;
    });
    _landmarks = await loaderBloc.findLandmarksByLocation(
      latitude: _location.coords.latitude,
      longitude: _location.coords.longitude,
      radiusInKM: radius,
    );
    var end = DateTime.now();
    var m = end.difference(start).inMilliseconds;
    setState(() {
      isBusy = false;
      count = _landmarks.length;
      elapsed = '$m milliseconds elapsed for search';
      message = 'Search for landmarks completed';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('Landmark Search'),
        elevation: 8,
        backgroundColor: Colors.pink[300],
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _getCurrentLocation,
          ),
        ],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(280),
          child: _buildBottomChild(),
        ),
      ),
      backgroundColor: Colors.pink[50],
      body: Stack(
        children: <Widget>[
          isBusy? Center(child: BusyCard(
            indicatorColor: Colors.teal[300],
            cardColor: Colors.pink[50],
          )) : Container(),
          isBusy? Container() : ListView.builder(
            itemCount: _landmarks.length,
            itemBuilder: (BuildContext context, int index) {
              return Padding(
                padding: const EdgeInsets.only(left:8.0, right: 8),
                child: Card(
                  elevation: 3,
                  child: ListTile(
                    title: Text(_landmarks.elementAt(index).landmarkName),
                    subtitle: Text('${_landmarks.elementAt(index).distance}'),
                    leading: Icon(Icons.location_city, color: Colors.grey[400],),
                    onTap: () {
                      debugPrint('🔴🔴 landmark tapped: 💚 ${_landmarks.elementAt(index).landmarkName} 💚 ${_landmarks.elementAt(index).landmarkID} ');
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
    print('🔵 🔵 🔵  _onSliderChangeEnded: changed radius of search to:  🔴 $value km,  🐥 🐥 🐥 starting search');
    setState(() {
      radius = value;
    });
    _startSearch();
  }

  Widget _buildBottomChild() {

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Expanded(
                child: Container(
                  child: Text(
                    'Use Atlas database to search for Landmarks using current location. Check for speed and accuracy!'
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
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                SizedBox(width: 20,),
                Text('$radius', style: Styles.blueBoldMedium,),
                SizedBox(width: 4,),
                Text('km'),
                SizedBox(width: 4,),
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
    );

  }
}

class BusyCard extends StatelessWidget {
  final String title;
  final Color indicatorColor, cardColor;

  const BusyCard({Key key, this.title, this.indicatorColor, this.cardColor}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 16,
      color: cardColor == null? Colors.white : cardColor,
      child: Container(
        height: 300, width: 300,
        child: Column(
        children: <Widget>[
          SizedBox(height: 40,),
          Text(title == null?'Searching by Location' : title, style: Styles.blackBoldMedium,),
          SizedBox(height: 40,),
          Container(
            height: 80, width: 80,
            child: CircularProgressIndicator(
              backgroundColor: indicatorColor == null? Colors.pink : indicatorColor,
              strokeWidth: 40,
            ),
          ),

        ],
    ),
      ),);
  }
}

class Results extends StatelessWidget {
  final int count;
  final String message, elapsed;
  final TextStyle textStyle;

  const Results({Key key, this.textStyle, this.count, this.message, this.elapsed}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: <Widget>[
              Text(message, style: Styles.blackBoldSmall,),
              SizedBox(width: 20,),
              Text('$count', style: Styles.blackBoldReallyLarge,),
            ],
          ),
          elapsed == null? Container() : Row(
            children: <Widget>[
              Text(elapsed, style: textStyle == null? Styles.whiteSmall : textStyle,),
            ],
          ),
        ],
      ),
    );
  }
}



