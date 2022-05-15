import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Input, ListItem, Button } from '@rneui/base';
import { Icon } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('addressdb.db');

export default function Places({ navigation }) {
    const [address, setAddress] = useState('');
    const [dbAddresses, setDbAddresses] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists addresses (id integer primary key not null, address text);');
        }, null, updateAddressList);
    }, []);

    const updateAddressList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from addresses;', [], (_, { rows }) =>
                setDbAddresses(rows._array)
            );
        });
    };

    const saveAddress = () => {
        db.transaction(tx => {
            tx.executeSql('insert into addresses (address) values (?);', [address]);
        }, null, updateAddressList
        )
        setAddress("");
    };

    const deleteAddress = (id) => {
        db.transaction(
            tx => {
                tx.executeSql(`delete from addresses where id = ?;`, [id]);
            }, null, updateAddressList)
    }

    const renderAddresses = ({ item }) => (
        <ListItem bottomDivider>
            <View>
                <ListItem.Content>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '60%' }}>
                            <ListItem.Title onLongPress={() => deleteAddress(item.id)}>{item.address}</ListItem.Title>
                        </View>
                        <View style={{ flexDirection: 'row', width: '40%' }}>
                            <View style={{ width: '80%' }}>
                                <ListItem.Subtitle style={{ color: 'grey' }} 
                                onPress={() => navigation.navigate('Map', {address:item.address})}>{"show on map"}</ListItem.Subtitle>
                            </View>
                            <View style={{ width: '20%' }}>
                                <Icon name='navigate-next' onPress={() => navigation.navigate('Map', {address:item.address})} />
                            </View>
                        </View>
                    </View>
                </ListItem.Content>
            </View>
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Input style={{ width: "90%" }}
                label='PLACEFINDER'
                placeholder='Type in an address'
                onChangeText={text => setAddress(text)}
                value={address} />
            <View style={{ width: '90%' }}>
                <Button
                    buttonStyle={{ backgroundColor: "grey" }}
                    onPress={saveAddress}
                    title='SAVE'
                    icon={<Icon name='save' color='white' />} />
            </View>
            <FlatList
                data={dbAddresses}
                keyExtractor={item => item.id.toString()}
                renderItem={renderAddresses} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});