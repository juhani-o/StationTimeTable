import {  StyleSheet  } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#70a31a',
    color: 'white',
    flex: 1,
  },
  autoCompleteMain: {
    backgroundColor: '#70a31a',
    color: '#f7faf3',
    elevation: 0,
    fontSize: 22,
    margin: 10,
    borderWidth: 0,
  },
  tabBar: {
    backgroundColor: '#70a31a', elevation: 0, borderColor: '#000000', borderBottomWidth: 1, height:50
  },
  tabBarLabel: {
    fontSize: 14
  },
  tabBarIndicator: {
    backgroundColor: '#99de25',
    height: 4
  },
  tableContainer: {
    flex: 1,
    padding: 0,
    paddingTop: 0,
    backgroundColor: '#ffffff'
  },
  tableBorderStyle: {
    borderWidth: 0,
  },
  tableHead: {
     height: 40,
     backgroundColor: 'white',
     borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableHeadText: {
    fontSize: 14,
    paddingLeft: 8,
    paddingTop: 4,
    color: '#A0A0A0'
  },
  cellView: {
  },
  cellText: {
    height: 40,
    paddingLeft: 8
  },
  cellTextInactive: {
    color: '#A0A0A0',
    paddingLeft: 8
  },
  cellTextRed: {
    color: '#FF0000',
    paddingLeft: 8
  },
  tableWrapperRow: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 0
  },
  tabContainer: {
    marginTop: 70,
    backgroundColor: 'black'
  },
  scene: {
    flex: 1,
    color: 'transparent'
  },

  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    borderWidth: 0

  },
  descriptionContainer: {
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,

  },
  infoText: {
    textAlign: 'center',
    fontSize: 26,
  },
    head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6},
  
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 }
});

export default styles;


