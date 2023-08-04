import React, {useState, useEffect} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// import { Table, Row } from 'react-native-table-component';

import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome';

import Navbar from './Navbar';

import {Picker} from '@react-native-picker/picker';

import {BASE_URL} from '../ConfigLinks';

import {Table, Row, Rows} from 'react-native-table-component';

const MyAttendance = ({date}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [columns, setColumns] = useState([
    'Date',

    'Punch-in',

    'Punch-out',

    'status',

    'Approve/Rejected',
  ]);

  const [data, setData] = useState([]);

  const [searchText, setSearchText] = useState(''); // State variable to store the search text

  const [filteredData, setFilteredData] = useState([]); // State variable to store the filtered data

  const [selectedOption, setSelectedOption] = useState('Staff Attandance');

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleRefresh = () => {
    setRefreshing(true);

    fetchData(); // Call the fetchData function again to refresh the data

    setRefreshing(false);
  };

  const fetchData = async () => {
    ///console.warn('click happened');

   setRefreshing(true)
  
    try {
      //console.log("hii")
      const datePart = date.toISOString().split('T')[0];
      console.log(datePart);

      const res = await axios.get(`${BASE_URL}/attendance/myAttendance?date=${datePart}/`);

      console.log(res);

      const parsedData = res?.data;

      console.log("apidatamyAt",parsedData);

      if (parsedData.success && parsedData.data) {
        const userData = parsedData.data[0].punches;

        //console.log(parsedData)

        console.log('\nUserData', userData);

        const mappedData = userData.map(item => {
          // console.log('item111234', item);

          const formatTime = time => {
            return item.punchIn
              ? new Date(item.punchIn).toLocaleTimeString([], {
                  hour: '2-digit',

                  minute: '2-digit',

                  hour12: true,
                })
              : 'N/A';
          };

          const punchInTime = item.punchIn
            ? new Date(item.punchIn).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';

          const punchOutTime = item?.punchOut
            ? new Date(item.punchOut).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'Null';

          const approvedByValue = item?.approvedBy?.name
            ? item?.approvedBy.name
            : item.rejectedBy?.name
            ? item.rejectedBy.name
            : 'Need Action';

          return {
            Date: new Date(parsedData.data[0].date).toLocaleDateString(
              'en-GB',
              {
                year: 'numeric',

                month: '2-digit',

                day: '2-digit',
              },
            ),

            punchIn: punchInTime,

            PunchOut: punchOutTime,

            status: item.status,

            Type: 'Pending',

            ApprovedBy: approvedByValue,
          };
        });

        setData(mappedData);

        console.log('renderData', mappedData); // console the

        setFilteredData(mappedData);

       setRefreshing(false)

        setIsLogin(true);

        //alert('MyAttendance data fetched successfully');
      } else {
        console.log('Invalid data format:', parsedData);

        setRefreshing(false)
      }
    } catch (err) {
      console.log(`API Error: ${err}`);

      setRefreshing(false)
    }
  };

  const tableHeader = () => (
    <View style={styles.header}>
      <ScrollView horizontal={true}>
        {columns.map((column, index) => (
          <Text style={styles.text} key={index}>
            {column}
          </Text>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView horizontal>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={tableHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({item, index}) => (
          //console.log('overwrite',item),

          <View style={styles.tableRow}>
            <Text style={styles.columnRowTxt}>{item.Date}</Text>

            <Text style={styles.columnRowTxt}>{item.punchIn}</Text>

            <Text style={styles.columnRowTxt}>{item.PunchOut}</Text>

            <Text style={styles.columnRowTxt}>{item.status}</Text>

            <Text style={styles.columnRowTxt}>{item.ApprovedBy}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,

    color: 'black',

    fontWeight: '500',

    // padding: 10,

    paddingHorizontal: 20, // Reduce the padding for better fitting in table cells
    paddingHorizontal: 25,

    textAlign: 'center', // Center the text within each cell

    fontFamily: 'Inter',

    fontWeight: 'bold',
  },

  Bodytext: {
    fontFamily: 'Inter',

    fontSize: 14,

    fontWeight: '400',

    textAlign: 'center',

    padding: 6,
  },

  header: {
    backgroundColor: '#ECEDFE',

    paddingVertical: 15,

    marginBottom: 12,

    flexDirection: 'row',

    justifyContent: 'space-evenly',

    alignItems: 'center',

    borderTopEndRadius: 5,

    borderTopStartRadius: 2,
  },

  row: {
    borderBottomColor: 'white',

    borderBottomWidth: 1,
  },

  tableRow: {
    flexDirection: 'row',

    height: 40,

    alignItems: 'center',

    width: '90%', // Set the row width to the screen width

    color: 'black',
  },

  dropdown: {
    backgroundColor: 'white',

    borderWidth: 0.1,

    borderRadius: 10,

    overflow: 'hidden',

    width: '40%', // Set the width to a small value to make the dropdown small

    // height: '50%',

    borderColor: '#F0F0F0',

    elevation: 1,

    justifyContent: 'center',
  },

  picker: {
    height: '10%',

    width: '100%',

    color: '#000',

    // justifyContent:'center',

    // alignItems:'center'

    textAlign: 'center',

    // marginBottom:20

    // flex:1
  },

  columnRowTxt: {
    color: 'black',

    flex: 1, // Set each column to occupy an equal portion of the row

    textAlign: 'center',

    fontSize: 12,

    overflow: 'hidden',
  },

  attendanceContainer: {
    backgroundColor: '#fff',

    height: '90%',
  },

  dateFilterContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: 10,

    borderColor: '#283093',

    borderWidth: 1,

    borderRadius: 10, // Adjust the border radius as needed

    paddingHorizontal: 10,

    paddingVertical: '1.5%',

    maxWidth: 200,

    marginLeft: '25%',
  },

  dateText: {
    fontSize: 16,

    fontWeight: 'bold',

    // marginHorizontal: 10,

    color: '#283093',
  },
});

export default MyAttendance;
