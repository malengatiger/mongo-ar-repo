import 'package:flutter/material.dart';
import 'package:card_settings/card_settings.dart';
import 'package:mongobaby/ui/snack.dart';
import 'package:mongobaby/ui/util.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  final GlobalKey<FormState> _formKey = GlobalKey();
  final GlobalKey<ScaffoldState> _key = GlobalKey();
  String appID = '', databaseName = '', collectionName = '';
  TextEditingController _appController = TextEditingController();
  TextEditingController _dbController = TextEditingController();
  TextEditingController _colController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _getSettings();
  }
  void _getSettings() async {
    appID = await getAppID();
//    _appController.text = appID;
    databaseName = await getDatabaseName();
//    _dbController.text = databaseName;
    collectionName = await getCollectionName();
//    _colController.text = collectionName;
    setState(() {

    });
  }
  @override
  Widget build(BuildContext context) {
    print('🔆🔆🔆 .......... build 🔆🔆🔆🔆🔆🔆 .......');
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('MongoDB Settings'),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(100),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: <Widget>[
                Text(
                  'These settings control the database that you  want the app to connect to. Also, the choice of whether to user either the Atlas Database in the sky or the local embedded database.',
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.done),
            onPressed: _onButtonPressed,
          )
        ],
      ),
      backgroundColor: Colors.brown[50],
      body: Padding(
        padding: const EdgeInsets.all(4.0),
        child: Form(
          key: _formKey,
          child: CardSettings(
            cardElevation: 8,
            children: <Widget>[
              CardSettingsHeader(label: 'Use Stitch App'),
              CardSettingsText(
                label: 'App ID ',
                initialValue: appID,
                hintText: 'enter App ID',
                icon: Icon(Icons.ac_unit, color: Colors.pink,),
                validator: (value) {
                  print('🍎   validation:  appID 👽 ');
                  if (value == null || value.isEmpty)
                    return 'App ID is required.';
                },
                onSaved: _onAppIDSaved,
                onChanged: _onAppIDChanged,
              ),
              SizedBox(
                height: 20,
              ),
              CardSettingsHeader(label: 'Use Database'),
              CardSettingsText(
                label: 'DB Name',
                initialValue: databaseName,
                hintText: 'enter name',
                icon: Icon(Icons.access_time, color: Colors.pink,),
                validator: (value) {
                  print('🍎   validation:  db name 👽 ');
                  if (value == null || value.isEmpty)
                    return 'Database name is required.';
                },
                onSaved: _onDBSaved,
                onChanged: _onDBChanged,
              ),
              SizedBox(
                height: 20,
              ),
              CardSettingsHeader(label: 'Use Collection'),
              CardSettingsText(
                label: 'Coll Name',
                initialValue: collectionName,
                icon: Icon(Icons.airport_shuttle, color: Colors.pink,),
                hintText: 'enter collection',
                validator: (value) {
                  print('🍎   validation:  collection 👽 ');
                  if (value == null || value.isEmpty)
                    return 'Collection name is required.';
                },
                onSaved: _onCollSaved,
                onChanged: _onCollChanged,
              ),
              SizedBox(
                height: 20,
              ),
              Container(
                width: 200,
                color: Colors.purple[300],
                child: FlatButton(
                  onPressed: _onButtonPressed,
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Text(
                      'Save Settings',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onDBChanged(String newValue) {
    print('🦊🦊🦊  Database name changed: 👽 $newValue');
    databaseName = newValue;
  }

  void _onDBSaved(String newValue) {
    print('🦊🦊🦊  Database name saved: 👽 $newValue');
    databaseName = newValue;
  }

  void _onCollChanged(String newValue) {
    print('🥦 🥦 🥦   Collection name changed: 👽 $newValue');
    collectionName = newValue;
  }

  void _onCollSaved(String newValue) {
    print('🥦 🥦 🥦   Collection name saved: 👽 $newValue');
    collectionName = newValue;
  }

  void _onAppIDChanged(String newValue) {
    print('🌺 🌺 🌺  AppID name changed: 👽 $newValue');
    appID = newValue;
  }

  void _onAppIDSaved(String newValue) {
    print('🌺 🌺 🌺  AppID name saved: 👽 $newValue');
    appID = newValue;
  }

  void _onButtonPressed() async {
    print('🥦 👽 👽 👽 👽 _onButtonPressed 👽 👽 👽 👽 ....... ');
//    appID = _appController.toString();
//    databaseName = _dbController.toString();
//    collectionName = _colController.toString();

    if (appID == null || appID.isEmpty) {
      var msg = ('👽  👽  👽  appID not valid: 👽 ');
      print(msg);
      _showErrorSnack(msg);
      return;
    }
    await saveAppID(appID);
    if (databaseName == null || databaseName.isEmpty) {
      var msg = ('👽  👽  👽 databaseName not valid: 👽 ');
      print(msg);
      _showErrorSnack(msg);
      return;
    }
    await saveDatabaseName(databaseName);
    if (collectionName == null || collectionName.isEmpty) {
      var msg = ('👽  👽  👽  collectionName not valid: 👽 ');
      print(msg);
      _showErrorSnack(msg);
      return;
    }
    await saveCollectionName(collectionName);
    print('settings 👌 OK, probably saved in sharedprefs 👌👌👌 ');
  }

  void _showErrorSnack(String message) {
    print('........ showSnack ....');
    AppSnackbar.showErrorSnackbar(scaffoldKey: _key, message: message, actionLabel: '', listener: null);
  }

  void _listenToAppID() {
    print(_appController.text);
  }
}
