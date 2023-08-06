import React, {useState, useEffect, useContext} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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
  Alert,
} from 'react-native';
// import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import {Picker} from '@react-native-picker/picker';
import {BASE_URL} from '../ConfigLinks';
import MyAttendance from './MyAttendance';
import Feather from 'react-native-vector-icons/Feather';
import LoadingScreen from './LoadingScreen';
import {AuthContext} from '../context/AuthContext';
// import { BASE_URL } from '../ConfigLinks';

const TableComp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const {userInfo, logout} = useContext(AuthContext);

  const {employee} = userInfo;
  const profile = employee ? employee.jobProfileId.jobProfileName : null;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [columns, setColumns] = useState([
    'Date',
    'Name',
    'Punch-in',
    'Punch-out',
    'Status',
    'Apporved/Reject',
  ]);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState(''); // State variable to store the search text
  const [filteredData, setFilteredData] = useState([]); // State variable to store the filtered data
  const [selectedOption, setSelectedOption] = useState('Staff Attandance');
  const [showEmployeePuches, setShowEmployeePunches] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeePunch, setEmployeePunch] = useState('');
  const [selectJobProfile, setSelectJobProfile] = useState();
  const [jobProfiles, setJobProfiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedDate,selectJobProfile,searchText]);
  
  /*useEffect(() => {
    handleJobProfile()
  },[selectJobProfile]);
  useEffect(() => {
   handleSearch()
  },[searchText]);
  */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(); // Call the fetchData function again to refresh the data
    setRefreshing(false);
  };

  
  const fetchJobProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/jobProfile`);
      //console.log("job profile",res.data.docs)
      setJobProfiles(res.data.docs);
      //console.log(jobProfiles.length)
    } catch (err) {
      console.log(err);
    }
  };
  fetchJobProfile()
  const handleJobProfile =async() => {
   setRefreshing(true)
   

    try {
      const res = await axios.get(
        `${BASE_URL}/attendance?jobProfileName=${selectJobProfile}`,
      );

      const parsedData = res?.data;
      //console.log("apidata",parsedData);
      const userData = parsedData.attendanceRecords;
      console.log(userData);
      if (parsedData.success && parsedData.attendanceRecords) {
        const mappedData = userData.map(item => {
          //console.log('item111234', item);
          let len = item.punches.length;

          // Extracting the time from the "punchIn" value
          const punchInTime = item.punches[len-1]?.punchIn
            ? new Date(item.punches[len-1].punchIn).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';
          const punchOutTime = item.punches[len-1]?.punchOut
            ? new Date(item.punches[len-1].punchOut).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'Null';
          const approvedByValue = item.punches[len-1]?.approvedBy?.name
            ? item.punches[len-1]?.approvedBy.name
            : item.punches[len-1]?.rejectedBy?.name
            ? item.punches[len-1].rejectedBy.name
            : 'Need Action';

          return {
            Date: new Date(item.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
            name: item.employeeId.name,
            punchIn: punchInTime,
            PunchOut: punchOutTime,
            status: item.punches[len - 1].status,
            Type: 'Pending',
            ApprovedBy: approvedByValue,
            id: item.employeeId._id,
            originalPunchIn: item.punches[len - 1].punchIn,
            date: item.date,
          };
        });

        setData(mappedData);
        setRefreshing(false)
        //console.log("renderData",mappedData);// console the
        setFilteredData(mappedData);
        //setIsLoading(false);
        //setIsLogin(true);
        //alert('Attendance data fetched successfully');
      } else {
        console.log('Invalid data format:', parsedData);
        setRefreshing(false)
      }
    } catch (err) {
      console.log(`API Error: ${err}`);
      setRefreshing(false)
    }
  };
  const filter = (data) => {
    console.log("\n",searchText)
    const searchQuery = searchText.toLowerCase();
    
    const filteredData = data.filter(item => {
      return item.nameLower.includes(searchQuery);
    });
    
    return filteredData;
  };
  
  const handleSearch =async() => {
    //setRefreshing(true)
    /*try {
       const res = await axios.get(
         `${BASE_URL}/attendance?name=${searchText}`,
       );
 
       const parsedData = res?.data;
       //console.log("apidata",parsedData);
       const userData = parsedData.attendanceRecords;
       console.log(userData);
       if (parsedData.success && parsedData.attendanceRecords) {
         const mappedData = userData.map(item => {
           //console.log('item111234', item);
           let len = item.punches.length;
 
           // Extracting the time from the "punchIn" value
           const punchInTime = item.punches[len-1]?.punchIn
             ? new Date(item.punches[len-1].punchIn).toLocaleTimeString([], {
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true,
               })
             : 'N/A';
           const punchOutTime = item.punches[len-1]?.punchOut
             ? new Date(item.punches[len-1].punchOut).toLocaleTimeString([], {
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true,
               })
             : 'Null';
           const approvedByValue = item.punches[len-1]?.approvedBy?.name
             ? item.punches[len-1]?.approvedBy.name
             : item.punches[len-1]?.rejectedBy?.name
             ? item.punches[len-1].rejectedBy.name
             : 'Need Action';
 
           return {
             Date: new Date(item.date).toLocaleDateString('en-GB', {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
             }),
             name: item.employeeId.name,
             punchIn: punchInTime,
             PunchOut: punchOutTime,
             status: item.punches[len - 1].status,
             Type: 'Pending',
             ApprovedBy: approvedByValue,
             id: item.employeeId._id,
             originalPunchIn: item.punches[len - 1].punchIn,
             date: item.date,
           };
         });
 
         setData(mappedData);
         setRefreshing(false)
         //console.log("renderData",mappedData);// console the
         //setFilteredData(mappedData);
         //setIsLoading(false);
         //setIsLogin(true);
         //alert('Attendance data fetched successfully');
       } else {
         console.log('Invalid data format:', parsedData);
         setRefreshing(false)
       }
     } catch (err) {
       console.log(`API Error: ${err}`);
       setRefreshing(false)
     }*/
     const filterData=filter(data)
     setData(filterData)
   };

  const handleEmployeePunch = async name => {
    if (showEmployeePuches) {
      setShowEmployeePunches(false);
      setEmployeeData([]);
    } else {
      setShowEmployeePunches(true);
    }

    setRefreshing(true)
    setEmployeePunch(name);
    console.log('Name', name);
    //console.log("\n")
    if (showEmployeePuches === false) {
      try {
        const datePart = selectedDate.toISOString().split('T')[0];
        console.log(datePart);
        const res = await axios.get(
          `${BASE_URL}/attendance?name=${name}&date=${datePart}`,
        );

        const parsedData = res?.data;
        //console.log('apidata', parsedData);
        if (parsedData.success && parsedData.attendanceRecords) {
          const userData = parsedData.attendanceRecords[0].punches;

          console.log('data', userData.length);

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
              Date: new Date(parsedData.attendanceRecords[0].date).toLocaleDateString(
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
              id: parsedData.attendanceRecords[0].employeeId._id,
              originalPunchIn: item.punchIn,
              date: parsedData.attendanceRecords[0].date,
            };
          });
          //updatedData=mappedData.shift()
          //console.log(updatedData.length)
          // Remove the first object from the array
          mappedData.reverse();
          mappedData.splice(0, 1);

          console.log(mappedData);

          setEmployeeData(mappedData);
          //console.log('renderData', mappedData); // console the
          //setFilteredData(mappedData);
          setRefreshing(false)
          //setIsLogin(true);
          //alert('Attendance data fetched successfully');
        } else {
          console.log('Invalid data format:', parsedData);
          setRefreshing(false)
        }
      } catch (err) {
        console.log('appi err in table', err);
        setRefreshing(false)
      }
    } else {
      console.log('hii');
      setEmployeeData([]);
      setRefreshing(false)
    }
  };
  const fetchData = async () => {
    // console.warn('click happened');
    //setIsLoading(true);

    try {
      // const res = await axios.get('https://hrms-backend-04fw.onrender.com/api/v1/attendance/');
      //console.log(selectedDate);
      const datePart = selectedDate.toISOString().split('T')[0];
      //console.log(datePart);
      const res = await axios.get(`${BASE_URL}/attendance?jobProfileName=${encodeURIComponent(
        selectJobProfile,
      )}&name=${encodeURIComponent(searchText)}&date=${encodeURIComponent(datePart)}/`);

      const parsedData = res?.data;
      // console.log('apidata', parsedData);
      if (parsedData.success && parsedData.attendanceRecords) {
        const userData = parsedData.attendanceRecords;
      
       
        const mappedData = userData.map(item => {
          //console.log('item111234', item);
          let len = item.punches.length;
          //console.log("data",item.punches[len - 1])
          

          const punchInTime = item.punches[len - 1]?.punchIn
            ? new Date(item.punches[len - 1].punchIn).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';
          const punchOutTime = item.punches[len - 1]?.punchOut
            ? new Date(item.punches[len - 1].punchOut).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'Null';
          const approvedByValue = item.punches[len - 1]?.approvedBy?.name
            ? item.punches[len - 1]?.approvedBy.name
            : item.punches[len - 1]?.rejectedBy?.name
            ? item.punches[len - 1].rejectedBy.name
            : 'Need Action';

          return {
            Date: new Date(item.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
            name: item.employeeId.name,
            punchIn: punchInTime,
            PunchOut: punchOutTime,
            status: item.punches[len - 1].status,
            Type: 'Pending',
            ApprovedBy: approvedByValue,
            id: item.employeeId._id,
            originalPunchIn: item.punches[len - 1].punchIn,
            date: item.date,
          };
        });
      

        setData(mappedData);
        console.log('renderData', mappedData); // console the
        setFilteredData(mappedData);
        setRefreshing(false)
        setIsLogin(true);
        //alert('Attendance data fetched successfully');
      
      } else {
        console.log('Invalid data format:', parsedData);
        setRefreshing(false)
      }
    } catch (err) {
      console.log('appi err in table', err);
      setRefreshing(false)
    }
  };
  const handleReject = (Id, punchIn, date) => {
    console.log(Id, punchIn, date);
    setRefreshing(true);

    axios
      .patch(`${BASE_URL}/attendance/updateAttendance`, {
        employeeId: Id,
        status: 'reject',
        punchInTime: punchIn,
        date: date,
      })
      .then(res => {
        setRefreshing(false);
        //Alert.alert("Status Update Sucessfully")
        //setRefreshing(true)
        fetchData();
        setShowEmployeePunches(false);
        //handleEmployeePunch(employeePunch)
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        //Alert.alert(err)
      });
  };
  const handleApproved = (Id, punchIn, date) => {
    console.log(Id, punchIn, date);
    setRefreshing(true);
    axios
      .patch(`${BASE_URL}/attendance/updateAttendance`, {
        employeeId: Id,
        status: 'approved',
        punchInTime: punchIn,
        date: date,
      })
      .then(res => {
        setRefreshing(false)
        //Alert.alert("Status Update Sucessfully")
        //setRefreshing(true)
        setShowEmployeePunches(false);
        fetchData();
        //handleEmployeePunch(employeePunch)
      })
      .catch(err => {
        setRefreshing(false)
        console.log(err);
        //Alert.alert(err)
      });
  };
  const handlePendingStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Approved',
          onPress: () => handleApproved(Id, punchIn, date),
        },
        {
          text: 'Reject',
          onPress: () => handleReject(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handleApprovedStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Reject',
          onPress: () => handleReject(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handleRejectStatusClick = (Id, punchIn, date) => {
    Alert.alert(
      'Select Action',
      'Choose an action for the change status of employee',
      [
        {
          text: 'Approved',
          onPress: () => handleApproved(Id, punchIn, date),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };
  const handlePrevDate = () => {
    console.log(selectedDate);

    const prevDate = new Date(selectedDate);

    prevDate.setDate(prevDate.getDate() - 1);

    setSelectedDate(prevDate);
    setRefreshing(true)
    {/*if(selectedOption === 'Staff Attandance'){
    setSearchText('');
    setSelectJobProfile('Job Profile');
    setEmployeePunch('');
    handleRefresh();
    }*/}
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);

    nextDate.setDate(nextDate.getDate() + 1);

    setSelectedDate(nextDate);
    setRefreshing(true)
    {/*if(selectedOption === 'Staff Attandance'){
      setSearchText('');
      setSelectJobProfile('Job Profile');
      setEmployeePunch('');
      handleRefresh();
      }*/}
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
      <View style={styles.container}>
        <Navbar />
        
          <View style={styles.container2}>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 19, fontWeight: '700', color: 'black'}}>
                Attendance DataBase
              </Text>
            </View>
            <View style={{flexDirection: 'column'}}>
            {selectedOption === 'Staff Attandance' &&
              <View style={styles.searchBarContainer}>
                <Icon name="search" style={styles.searchIcon} />
                <TextInput
                  style={{...styles.searchInput, color: 'black'}}
                  placeholder="Search"
                  placeholderTextColor="#B0B0B0"
                  onChangeText={text => {
                    setSearchText(text);
                   
                  }}
                 
                  value={searchText}
                />
              </View>
  }
              <View
                style={selectedOption === 'Staff Attandance'?styles.dropdownbox:styles.singlebox}
              >
              
                <View style={styles.dropdown}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedOption}
                    onValueChange={itemValue => setSelectedOption(itemValue)}
                    itemStyle={{color: 'black'}} // Set text color for Picker items
                  >
                   
                    <Picker.Item
                      label="Your Attandance"
                      value="Your Attandance"
                    />
                    <Picker.Item
                      label="Staff Attandance"
                      value="Staff Attandance"
                    />
                  </Picker>
                  {/* Custom Arrow Icon */}
                </View>
                {/* //filter have to add datapicker*/}

                {/* Search bar */}
                {selectedOption === 'Staff Attandance' &&
                <View style={styles.dropdown}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectJobProfile}
                    onValueChange={itemValue => setSelectJobProfile(itemValue)}
                    itemStyle={{color: 'black'}} // Set text color for Picker items
                  >
                    <Picker.Item label="Job Profile" value="Any" />
                    {jobProfiles.map((item, index) => (
                      //console.log(item)
                      <Picker.Item
                        label={item.jobProfileName}
                        value={item.jobProfileName}
                      />
                    ))}
                  </Picker>
                  {/* Custom Arrow Icon */}
                  <View style={styles.arrowContainer}>
                    {/* <Icon name="caret-down" size={25} color="black" /> */}
                  </View>
                </View>}
              </View>
            </View>
          
            
           
           
            
          </View>
          <ScrollView>
          <View style={[styles.attendanceContainer]}>
              {selectedOption === 'Staff Attandance' ? (
                
                <ScrollView horizontal>
                  <FlatList
                    data={data}
                    ListHeaderComponent={tableHeader}
                    // horizontal={true}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        
                      />
                    }
                    renderItem={({item, index}) => (
                      //console.log('overwrite', item),
                      <View>
                        <View style={styles.tableRow}>
                          <View style={{width:"15%"}}>
                          <Text
                            style={{...styles.columnRowTxt, marginLeft: '2%'}}
                          >
                            {item.Date}
                          </Text>
                          </View>
                          
                          <View style={{width:"15%"}}>
                          <TouchableOpacity
                            style={[styles.columnRowTxt,{flexDirection: 'row',marginLeft: 10}]}
                          >
                            
                            <Text
                            numberOfLines={2}
                              onPress={() => handleEmployeePunch(item.name)}
                              
                            >
                              {item.name}
                            </Text>
                            
                            {showEmployeePuches &&
                            employeePunch === item.name ? (
                              <MaterialCommunityIcons
                                name="arrow-down"
                                size={15}
                                color="black"
                              />
                            ) : null}
                          </TouchableOpacity>
                          </View>
                          
                          <View style={{width:"15%"}}>
                          <Text
                            style={{
                              ...styles.columnRowTxt,
                              marginLeft: 10,
                              //marginBottom:"5%"
                            }}
                          >
                            {item.punchIn}
                          </Text>
                          </View>
                         <View>
                          <Text
                            style={{
                              ...styles.columnRowTxt,
                              marginLeft: 40,
                            }}
                          >
                            {item.PunchOut}
                          </Text>
                          </View>
                          <View style={{marginLeft:item.PunchOut==="Null"?"10%":"5%"}} > 
                          <Text
                            style={{
                              ...styles.columnRowTxt
                            }}
                          >
                            {item.status === 'pending' && (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: '#FEF5ED',
                                  borderRadius: 15,
                                  padding: 6,
                                  
                                }}
                              >
                                <Feather
                                  name="loader"
                                  color={'#945D2D'}
                                  size={15}
                                  style={{marginRight: 4}}
                                />
                                <Text style={{fontSize: 12, color: '#945D2D'}}>
                                  Pending
                                </Text>
                                <MaterialCommunityIcons
                                  name="dots-vertical" // Using the three-point menu icon
                                  color={'#945D2D'}
                                  size={15}
                                  style={{marginRight: 4}}
                                  onPress={() =>
                                    handlePendingStatusClick(
                                      item.id,
                                      item.originalPunchIn,
                                      item.date,
                                    )
                                  }
                                />
                              </View>
                            )}
                            {item.status === 'approved' && (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: '#E9F7EF',
                                  borderRadius: 15,
                                  padding: 6,
                                }}
                              >
                                <Feather
                                  name="check"
                                  color={'#186A3B'}
                                  size={15}
                                  style={{marginRight: 4}}
                                />
                                <Text style={{fontSize: 12, color: '#186A3B'}}>
                                  Approved
                                </Text>
                                <MaterialCommunityIcons
                                  name="dots-vertical" // Using the three-point menu icon
                                  color={'#186A3B'}
                                  size={15}
                                  style={{marginRight: 4}}
                                  onPress={() =>
                                    handleApprovedStatusClick(
                                      item.id,
                                      item.originalPunchIn,
                                      item.date,
                                    )
                                  }
                                />
                              </View>
                            )}
                            {item.status === 'rejected' && (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: '#FCECEC',
                                  borderRadius: 15,
                                  padding: 6,
                                }}
                              >
                                <Feather
                                  name="x"
                                  color={'#8A2626'}
                                  size={15}
                                  style={{marginRight: 4}}
                                />
                                <Text style={{fontSize: 12, color: '#8A2626'}}>
                                  Rejected
                                </Text>
                                <MaterialCommunityIcons
                                  name="dots-vertical" // Using the three-point menu icon
                                  color={'#8A2626'}
                                  size={15}
                                  style={{marginRight: 4}}
                                  onPress={() =>
                                    handleRejectStatusClick(
                                      item.id,
                                      item.originalPunchIn,
                                      item.date,
                                    )
                                  }
                                />
                              </View>
                            )}
                          </Text>
                          </View>

                          <Text
                            style={{
                              ...styles.columnRowTxt,
                              marginLeft: 30,
                              alignItems:"center",
                              marginBottom:"2%"
                            }}
                          >
                            {item.ApprovedBy}
                          </Text>
                        </View>
                        {showEmployeePuches === true &&
                          employeePunch === item.name && (
                            <FlatList
                              keyExtractor={(item, index) => index.toString()}
                              style={{
                                marginLeft: '15%',
                                borderLeftWidth: 0.5,
                                borderRightWidth: 0,
                                borderBottomWidth: 0,
                                borderTopWidth: 0,
                                borderColor: '#DEDEDE',
                                
                              }}
                              data={employeeData}
                              renderItem={({item, index}) => (
                                <View style={styles.tableRow}>
                                  
                                 <View  style={{width:"15%",marginLeft:"5%"}}>
                                  <Text
                                    style={{
                                      ...styles.columnRowTxt,
                                      marginLeft: 60,
                                    }}
                                  >
                                    {item.punchIn}
                                  </Text>
                                  </View>
                                  <View style={{width:"15%",marginLeft:"20%"}}>
                                  <Text
                                    style={{
                                      ...styles.columnRowTxt,
                                      
                                    }}
                                  >
                                    {item.PunchOut}
                                  </Text>
                                  </View>
                                  <View style={{width:"15%",marginLeft:"4%"}}>
                                  <Text
                                    style={{
                                      ...styles.columnRowTxt,
                                    }}
                                  >
                                    {item.status === 'pending' && (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          backgroundColor: '#FEF5ED',
                                          borderRadius: 15,
                                          padding: 6,
                                        }}
                                      >
                                        <Feather
                                          name="loader"
                                          color={'#945D2D'}
                                          size={15}
                                          style={{marginRight: 4}}
                                        />
                                        <Text
                                          style={{
                                            fontSize: 12,
                                            color: '#945D2D',
                                          }}
                                        >
                                          Pending
                                        </Text>
                                        <MaterialCommunityIcons
                                          name="dots-vertical" // Using the three-point menu icon
                                          color={'#945D2D'}
                                          size={15}
                                          style={{marginRight: 4}}
                                          onPress={() =>
                                            handlePendingStatusClick(
                                              item.id,
                                              item.originalPunchIn,
                                              item.date,
                                            )
                                          }
                                        />
                                      </View>
                                    )}
                                    {item.status === 'approved' && (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          backgroundColor: '#E9F7EF',
                                          borderRadius: 15,
                                          padding: 6,
                                        }}
                                      >
                                        <Feather
                                          name="check"
                                          color={'#186A3B'}
                                          size={15}
                                          style={{marginRight: 4}}
                                        />
                                        <Text
                                          style={{
                                            fontSize: 12,
                                            color: '#186A3B',
                                          }}
                                        >
                                          Approved
                                        </Text>
                                        <MaterialCommunityIcons
                                          name="dots-vertical" // Using the three-point menu icon
                                          color={'#186A3B'}
                                          size={15}
                                          style={{marginRight: 4}}
                                          onPress={() =>
                                            handleApprovedStatusClick(
                                              item.id,
                                              item.originalPunchIn,
                                              item.date,
                                            )
                                          }
                                        />
                                      </View>
                                    )}
                                    {item.status === 'rejected' && (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          backgroundColor: '#FCECEC',
                                          borderRadius: 15,
                                          padding: 6,
                                        }}
                                      >
                                        <Feather
                                          name="x"
                                          color={'#8A2626'}
                                          size={15}
                                          style={{marginRight: 4}}
                                        />
                                        <Text
                                          style={{
                                            fontSize: 12,
                                            color: '#8A2626',
                                          }}
                                        >
                                          Rejected
                                        </Text>
                                        <MaterialCommunityIcons
                                          name="dots-vertical" // Using the three-point menu icon
                                          color={'#8A2626'}
                                          size={15}
                                          style={{marginRight: 4}}
                                          onPress={() =>
                                            handleRejectStatusClick(
                                              item.id,
                                              item.originalPunchIn,
                                              item.date,
                                            )
                                          }
                                        />
                                      </View>
                                    )}
                                  </Text>
                                  </View>
                                  <View style={{width:"15%",marginLeft:"20%"}} >
                                  <Text
                                    style={{
                                      ...styles.columnRowTxt,
                                     
                                    }}
                                  >
                                    {item.ApprovedBy}
                                  </Text>
                                  </View>
                                </View>
                              )}
                            />
                          )}
                      </View>
                    )}
                  />
                </ScrollView>
                
              ) : (
                <MyAttendance date={selectedDate} />
              )}
            </View>
            </ScrollView>
         
        
    
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Icon name="arrow-left" size={20} color="black" />
          </TouchableOpacity>

          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>

          <TouchableOpacity onPress={handleNextDate}>
            <Icon name="arrow-right" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
   
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop:16,
  },
  container2: {
    padding: 10,
  },
  iconView: {
    //  backgroundColor:'#945D2D',
    color: '#945D2D',
  },
  BtnStatus: {
    fontSize: 10,
  },

  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    padding: 10,
    paddingHorizontal: 15, // Reduce the padding for better fitting in table cells
    paddingVertical: 20,
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
    // paddingVertical: 15,
    // paddingHorizontal: ,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    borderTopEndRadius: 5,
    borderTopStartRadius: 2,
  },
  row: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    marginBottom: 15,
    justifyContent: 'center',

    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    // height:40,
    marginTop: 10,
    borderWidth: 1,

    // borderRadius: 10,
    borderColor: '#F0F0F0',
    elevation: 1,
    justifyContent: 'center',
  },

  filterBarContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 5,
    marginBottom: 15,

    flexDirection: 'row',
    alignItems: 'center',
    width: '28%',
    // height:40,
    marginTop: 10,
    borderWidth: 1,
    // elevation: 2,
    // borderRadius: 10,
    borderColor: '#F0F0F0',
    elevation: 1,
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#C8C8C8',
    marginLeft: 10,
    width:"10%"
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#080808',
    marginLeft: 12,
  },
  searchInput: {
    fontSize: 16,
    height: 40,
    flex: 1,
    width:"90%"
  },
  tableRow: {
    flexDirection: 'row',
    height: 40,

    alignItems: 'center',
    width: '90%', // Set the row width to the screen width
    color: 'black',
  },
  nextedTableRow: {
    flexDirection: 'row',
    height: 40,
    margin: 10,

    alignItems: 'center',
    width: '80%', // Set the row width to the screen width
    color: 'black',
  },
  dropdown: {
    marginTop: '5%',
    backgroundColor: 'white',
    borderWidth: 0.1,
    borderRadius: 10,
    overflow: 'hidden',
    width: '50%',
    //height: '50%',
    marginRight: '10%',
    marginLeft: 50,
    borderColor: '#F0F0F0',

    //elevation: 1,
    // justifyContent: 'space-evenly',
  },
  picker: {
    height: '10%',
    width: '150%',
    color: '#000',
    // justifyContent:'center',
    // alignItems:'center'
    textAlign: 'center',
    // marginBottom:20
    // flex:1
  },
  columnRowTxt: {
    color: 'black',
    //flex:1,
    
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',

    fontSize: 12,
  },
  attendanceContainer: {
    backgroundColor: '#fff',
    height: '100%',
    // width: '90%',
    //marginBottom: '40%',
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
    marginBottom: '10%',
  },

  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginHorizontal: 10,
    color: '#283093',
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

    marginHorizontal: 10,

    color: '#283093',
  },
  dropdownbox:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  singlebox:{
    marginTop:"5%",
    marginBottom:"5%",
  
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'

  }
});

export default TableComp;