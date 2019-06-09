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
      print('🍏 🍎 appID: $appID 🍏 🍎 databaseName: $databaseName 🍏 🍎 collectionName: $collectionName');
    }
    setState(() {

    });
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
        title: Text('Dashboard'),
      ),
    );
  }
}
