import React, {useContext, useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {SafeAreaView, Image, TouchableOpacity} from 'react-native';
import Navbar from './Navbar';
import QRCode from 'react-native-qrcode-svg';
import Header from './Header';
import CalendarScreen from '../component/Calender';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';


const Home = ({navigation}) => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  console.log(userInfo.admin);
  const {employee} = userInfo;
  const name = employee ? employee.name : 'User';
  const currentBarCode = employee ? employee.currentBarCode : 'null';
  const screenHeight = Dimensions.get('window').height;
  console.log(currentBarCode);
  const handleDoc = () => {
    navigation.navigate('Documents');
  };

  return (
    <View style={{height: screenHeight * 0.8}}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.div}>
            <View>
              <Text style={styles.text}>Welcome Back {name}!</Text>
            </View>
            <View style={styles.qrContainer}>
              <Text
                style={{
                  marginBottom: 5,
                  fontWeight: '600',
                  fontFamily: 'Inter',
                  color: '#2E2E2E',
                  fontSize: 15,
                }}
              >
                Your Employee Barcode
              </Text>
              <Image
                style={{width: 250, height: 200, alignItems: 'center'}}
                source={{uri: `${currentBarCode}`}}
              />
            </View>
            <View style={styles.div1}>
              <View style={styles.subdiv}>
                <Text style={styles.text}>Your Leaves</Text>
              </View>
              <View>
                <CalendarScreen />
              </View>
            </View>
            <View>
              <View style={{marginTop: 20}}>
                <Text style={styles.text}>Quick Links</Text>
              </View>
              <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Training')}>
                  <View style={styles.linkContainer}>
                    <Icon name="users" size={16} color="blue" style={styles.arrowIcon} />
                    <Text style={styles.linkText}>Training</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Document")}>
                  <View style={styles.linkContainer}>
                    <Icon name="file" size={16} color="blue" style={styles.arrowIcon} />
                    <Text style={styles.linkText}>Documents</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  subdiv: {
    paddingVertical: 5,
  },
  div: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    borderRadius:9,
    paddingVertical: 30,
    backgroundColor: 'white', //#F0F0F0
    flexDirection: 'column',
  },

  text: {
    color: '#2E2E2E',
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  footer: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-around', // Align links to the left
  },

  Ftext: {
    color: '#283093',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 7,
  },
  div1: {

  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#ECEDFE',
    borderRadius: 5,
    // padding: 8,
    paddingLeft: 10,
    width: 150,
    height: 50,
  },
  arrowIcon: {
      marginLeft:10
  },
  linkText: {
    color: '#283093',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default Home;
