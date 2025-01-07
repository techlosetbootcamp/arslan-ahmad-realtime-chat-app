import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const Home = ({navigation}:any) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text style={{color: "black", textAlign: "center", fontSize: 20, marginBottom: 15}}>Home</Text>
      <Button title="Go to Contacts" onPress={() => navigation.navigate("Contacts")} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})