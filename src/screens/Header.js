import React, { useContext } from 'react';
import { View, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Home from './HomeScreen';
import { Text } from 'react-native';
import {showMessage} from 'react-native-flash-message';
const Header = ({ navigation }) => {
  const { login, isLogin, logout, loginres } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    showMessage({
      message: 'Logout Successful',
      type: 'success',
      floating: true,
    });
    navigation.navigate('LoginScreen');
  };
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        {isLogin ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{color:'black'}}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{color:'black'}}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <Home navigation={navigation} />
    </View>
  );
};
/*
Button
          title="Login"
          onPress={() => navigation.navigate('LoginScreen')}
          titleStyle={styles.button}*/
export default Header;
const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  logo: {
    height: 25,
    marginLeft:2
  },
  header: {
    marginTop: 5,
  },
});