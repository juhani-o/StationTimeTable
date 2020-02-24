const API_TRAINS = 'https://rata.digitraffic.fi/api/v1/live-trains/station/';
const API_TRAINS_PARAMS = 'arrived_trains=0&arriving_trains=20&departed_trains=0&departing_trains=20&include_nonstopping=false&train_categories=Commuter,Long-distance';

  /*
   *  Return URL for fetching trains
   */

  export function getFullTrainUrl(result) {
    const { query,stationsc } = result;
    if (query != null) {
      return (API_TRAINS + stationsc + '/?' + API_TRAINS_PARAMS);
    } else {
      return '';
    }
  }

/*
 *  Return time in HH:mm format.
 *  @param dateItem  Date in string format
 */

export function getSimpleShortTime(dateItem) {
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

export function getStationNameByCode(stationCode, stations) {
  try {
    const result = stations.filter(station => {
      return stationCode == station.stationShortCode;
    });
    return result[0].stationName;
  } catch(error) {
    console.log(error);
  }
}