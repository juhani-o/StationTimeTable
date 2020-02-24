import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar
} from 'react-native';

import styles from './components/css';
import Autocomplete from 'react-native-autocomplete-input';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

const API_STATIONS = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
const API_TRAINS = 'https://rata.digitraffic.fi/api/v1/live-trains/station/';
const API_TRAINS_PARAMS = 'arrived_trains=0&arriving_trains=20&departed_trains=0&departing_trains=20&include_nonstopping=false&train_categories=Commuter,Long-distance';
const CANCELLED = "Cancelled";
const AUTOCOMPLETE_PLACEHOLDER = "Valtse asema";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      trains: [],
      query: '',
      routes: [
        { key: 'departures', title: 'Lähtevät' },
        { key: 'arrivals', title: 'Saapuvat' },
      ],
      index: 0,
      tableHeadDepartures: ['Juna', 'Lähtöasema', 'Pääteasema', 'Lähtee'],
      tableHeadArrivals: ['Juna', 'Lähtöasema', 'Pääteasema', 'Saapuu'],
      tableDataArrivals: [],
      tableDataDepartures : [],
    };
  }


/*
 *  Return time in HH:mm format.
 *  @param dateItem  Date in string format
 */

  getSimpleShortTime(dateItem) {
    try {
      if (dateItem != undefined) {
        const dateDateItem = new Date(dateItem);
        const returnTime = dateDateItem.getHours().toString() + ':' + 
            (dateDateItem.getMinutes().toString().length == 1 ? '0' +
             dateDateItem.getMinutes().toString(): dateDateItem.getMinutes().toString());
        return returnTime;
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
    }
  }

/*
 *  Return full station name
 *  @param stationCode short code for station
 */

  getStationNameByCode(stationCode) {
    try {
      const result = this.state.stations.filter(station => {
        return stationCode == station.stationShortCode;
      });
      return result[0].stationName;
    } catch(error) {
      console.log(error);
    }
  }


/*
 *  Create lists for arriving and departing trains.
 */

  async generateListOfTrainsByStation() {

    try {
      const { trains, stationsc } = this.state;
      const arrivalsData = [];
      const departuresData = [];

      trains.map(train => {
        var trainText = train.trainType + ' ' + train.trainNumber;
        var startStation = train.timeTableRows[0].stationShortCode;
        var endStation = train.timeTableRows[train.timeTableRows.length -1].stationShortCode;
        var isCancelled = train.isCancelled;

        const result = train.timeTableRows.filter(ttableitem =>{
          return ttableitem.stationShortCode == stationsc;
        })

        result.map(timeTableItem => {

          const tableItem = [trainText,
              this.getStationNameByCode(startStation),
              this.getStationNameByCode(endStation), [
                this.getSimpleShortTime(timeTableItem.scheduledTime),
                this.getSimpleShortTime(timeTableItem.actualTime),
                isCancelled]
          ];

          if (timeTableItem.type == "ARRIVAL") {
            arrivalsData.push(tableItem);
          }

          if (timeTableItem.type == "DEPARTURE") {
            departuresData.push(tableItem);
          }

        })
        
      })

      this.setState({tableDataArrivals : arrivalsData});
      this.setState({tableDataDepartures : departuresData});

    } catch (error) {
      console.log(error);
    }
    
  }

  /*
   *  Called when application starts. This populates list of stations.
   */

  async componentDidMount() {
    try {
      const response = await fetch(`${API_STATIONS}`);
      const json = await response.json();

      /*  Remove stations which does not have personnel traffic */
      const filteredListOfStations = json.filter(station =>{
        return station.passengerTraffic == true;
      })

      this.setState({ stations: filteredListOfStations });

    } catch (error) {
      console.log(error);
    }
  }

  /*
   *  Get list of trains per station
   */

  async getTrains(stationName) {
    try {
      const fullTrainsURL = this.getFullTrainUrl(stationName);
      const response = await fetch(`${fullTrainsURL}`);
      const json = await response.json();
      this.setState({ trains: json });
    } catch (error) {
      console.log(error);
    }
  }

  /*
   *  Return URL for fetching trains
   */

  getFullTrainUrl(result) {
    const { query,stationsc } = result;
    if (query != null) {
      return (API_TRAINS + stationsc + '/?' + API_TRAINS_PARAMS);
    } else {
      return '';
    }
  }

  /*
   *  This is called after station is selected.
   *  Trains will be fetched and timetable populated by results.
   */

  async setStationAndFindTrains(result) {
    this.setState(result);
    await this.getTrains(result);
    await this.generateListOfTrainsByStation();
  };

  /*
   *  Used by autocomplete view
   */

  findStation = (query) => {

    if (query === '') {
      return [];
    }

    const { stations } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return stations.filter(station => station.stationName.search(regex) >= 0);
  }

  /*
   *  Custom TabBar for settings styles
   */

  renderTabBar = (props) => {
    return (<TabBar
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      />
    );
  }


  /*
   *  Draw cells to table row.
   */
   
  element = (data, index) => {

    if (index < 3) {
      return(
      <View style={styles.cellView}>
        <Text style={styles.cellText}>{data}</Text>
      </View>
    )}

    if (index == 3) {
      if (data[1] == "" && data[2] != true) {
        return(
          <View style={styles.cellView}>
            <Text style={styles.cellText}>{data[0]}</Text>
          </View>
        )
      } else if (data[1] != "") {
        return(
          <View style={styles.cellView}>
            <Text style={styles.cellTextRed}>{data[1]}</Text>
            <Text style={styles.cellText}>({data[0]})</Text>
          </View>
        )
      } else if (data[2] == true) {
        return(
          <View style={styles.cellView}>
            <Text style={styles.cellTextInactive}>{data[0]}</Text>
            <Text style={styles.cellTextRed}>{CANCELLED}</Text>
          </View>
        )
      }
    }
  };

  /*
   *  Render both tabs.
   */

  renderTabScene = ({ route }) => {

    const dataForTable = route.key == 'arrivals' ? this.state.tableDataArrivals : this.state.tableDataDepartures;
    const headForTable = route.key == 'arrivals' ? this.state.tableHeadArrivals : this.state.tableHeadDepartures;

      return (
      <View style={styles.tableContainer}>
      <Table borderStyle={styles.tableBorderStyle}>
        <Row data={headForTable} style={styles.tableHead} textStyle={styles.tableHeadText}/>
        {

          dataForTable.map((rowData, index) => (
            <TableWrapper key={index} style={styles.tableWrapperRow}>
              {
                rowData.map((cellData, cellIndex) => (
                  <Cell key={cellIndex} data={this.element(cellData, cellIndex)} textStyle={styles.text}/>
                ))
              }
            </TableWrapper>
          ))
        }
        

      </Table>
    </View>
    )

  };

  render() {
    const { query } = this.state;
    const { tableData } = this.state;
    const stations = this.findStation(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const state = this.state;

    return (
      <View style={styles.container}>

        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}

          data={
            stations.length === 1 && comp(query, stations[0].stationName) ? [] : stations
          }

          defaultValue={query}
          style={styles.autoCompleteMain}
          onChangeText={text => this.setState({ query: text })}
          placeholder={AUTOCOMPLETE_PLACEHOLDER}
          keyExtractor={(item, index) => item+index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.setStationAndFindTrains({query: item.stationName, stationsc: item.stationShortCode})}>
              <Text style={styles.itemText}>{item.stationName} ({item.stationShortCode})</Text>
            </TouchableOpacity>
          )}
        />

        <TabView
          navigationState={this.state}
          renderScene={this.renderTabScene}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width}}
          style={styles.tabContainer}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}


export default App;