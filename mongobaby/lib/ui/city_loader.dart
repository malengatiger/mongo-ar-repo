import 'package:aftarobotlibrary4/api/loader_bloc.dart';
import 'package:aftarobotlibrary4/api/sharedprefs.dart';
import 'package:aftarobotlibrary4/data/citydto.dart';
import 'package:aftarobotlibrary4/data/countrydto.dart';
import 'package:aftarobotlibrary4/util/functions.dart';
import 'package:flutter/material.dart';
import 'package:mongobaby/ui/snack.dart';

class CityLoader extends StatefulWidget {
  final List<CountryDTO> countries;

  const CityLoader({Key key, @required this.countries}) : super(key: key);

  @override
  _CityLoaderState createState() => _CityLoaderState();
}

class _CityLoaderState extends State<CityLoader> implements SnackBarListener {
  @override
  void initState() {
    super.initState();
    _buildMenu();
  }

  List<DropdownMenuItem<CountryDTO>> _items = List();
  CountryDTO _country;
  bool isBusy = false;


  _buildMenu() {
    widget.countries.forEach((c) {
      var item = DropdownMenuItem<CountryDTO>(
        child: Text(
          c.name,
          style: Styles.blackBoldSmall,
        ),
        value: c,
      );
      _items.add(item);
    });
//    _country = widget.countries.elementAt(0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _key,
      appBar: AppBar(
        title: Text('City Loader'),
        backgroundColor: Colors.teal[300],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(140),
          child: Column(
            children: <Widget>[
              DropdownButton(
                items: _items,
                onChanged: _onMenuSelected,
                hint: Text(
                  'Select Country',
                  style: Styles.blackBoldMedium,
                ),
              ),
              SizedBox(
                height: 20,
              ),
              Text(
                _country == null ? '' : _country.name,
                style: Styles.whiteBoldLarge,
              ),
              SizedBox(
                height: 20,
              ),
            ],
          ),
        ),
      ),
      backgroundColor: Colors.brown[50],
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Container(
          width: double.infinity,
          child: Card(
            elevation: 4,
            child: Column(
              children: <Widget>[
                SizedBox(
                  height: 40,
                ),
                _country != null
                    ? RaisedButton(
                        onPressed: () {
                          if (!isBusy) {
                            _loadCities();
                          }
                        },
                        color: Colors.pink,
                        elevation: 8,
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Text(
                            'Load Country Cities',
                            style: Styles.whiteSmall,
                          ),
                        ),
                      )
                    : Container(),
                Column(
                  children: <Widget>[
                    SizedBox(
                      height: 40,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(36.0),
                      child: isBusy
                          ? CircularProgressIndicator(
                              backgroundColor: Colors.pink,
                              strokeWidth: 20,
                            )
                          : Container(),
                    ),
                    SizedBox(
                      height: 40,
                    ),
                    isBusy ? Text('Loading Cities, Please Wait!') : Container(),
                    SizedBox(
                      height: 10,
                    ),
                    isComplete
                        ? Text(
                            _result,
                            style: Styles.blueBoldSmall,
                          )
                        : Container(),
                  ],
                ),
                isBusy
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: <Widget>[
                          Text(
                            'Cities Loaded',
                            style: Styles.greyLabelSmall,
                          ),
                          SizedBox(
                            width: 12,
                          ),
                          StreamBuilder<dynamic>(
                              stream: loaderBloc.changeStream,
                              builder: (context, snapshot) {
                                if (snapshot.hasData) {
                                  if (snapshot.data is int) {
                                    _addedCount = snapshot.data;
                                  }
                                }
                                return Padding(
                                  padding: const EdgeInsets.only(right: 40.0),
                                  child: Text(
                                    '$_addedCount',
                                    style: Styles.blackBoldLarge,
                                  ),
                                );
                              }),
                        ],
                      )
                    : Container(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  bool isComplete = false;
  int _addedCount = 0;
  String _result;
  void _onMenuSelected(CountryDTO country) async {
    debugPrint('♻️♻️♻️♻️♻️ country selected: ${country.name} ♻️♻️');
    loaderBloc.changeCountry(country);

    setState(() {
      _country = country;
    });
    loaderBloc.getLocalCities(countryID: _country.countryID);
  }

  void _loadCities() async {
    if (_country == null) {
      debugPrint('🐢🐢🐢 ️select country first ${DateTime.now()}️');
      return;
    }
    setState(() {
      isBusy = true;
    });
    debugPrint('🏈 🏈 🏈 🏈 ️loading Cities for: 🧩 ${_country.name} ♻️  countryID: ${_country.countryID}️');
    try {
      List<CityDTO> result = await loaderBloc.getRemoteCitiesAndLoad(
          country: _country);
      print(result);
      setState(() {
        isBusy = false;
        _country = null;
      });
      AppSnackbar.showSnackbarWithAction(
          scaffoldKey: _key,
          listener: this,
          action: 1,
          actionLabel: 'Done',
          message: "${result.length}  Cities loaded OK",
          textColor: Colors.lightGreen,
          backgroundColor: Colors.black);
    } catch (e) {
      setState(() {
        isBusy = false;
      });
      AppSnackbar.showErrorSnackbar(
          scaffoldKey: _key,
          message: "Failed to load cities",
          actionLabel: 'Done',
          listener: this);
    }
  }

  GlobalKey<ScaffoldState> _key = GlobalKey();

  @override
  onActionPressed(int action) {
    Navigator.pop(context);
  }
}
