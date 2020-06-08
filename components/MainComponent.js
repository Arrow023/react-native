import React,{Component} from 'react';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import DishDetail from './DishDetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {View,Platform,Image,StyleSheet,ScrollView,Text} from 'react-native';
import {createStackNavigator,createDrawerNavigator,DrawerItems,SafeAreaView} from 'react-navigation';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {fetchDishes,fetchComments,fetchPromos,fetchLeaders} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => ({
    fetchDishes:()=>dispatch(fetchDishes()),
    fetchComments:()=>dispatch(fetchComments()),
    fetchLeaders:()=>dispatch(fetchLeaders()),
    fetchPromos:()=>dispatch(fetchPromos()),
});

const MenuNavigator = createStackNavigator({
    Menu : {screen:Menu,
        navigationOptions:({navigation})=>({
            headerLeft:<Icon name='menu' size={24}
            color="white"
            onPress={()=>navigation.toggleDrawer()} />
        })
    },
    
    DishDetail :{screen:DishDetail}
},{
    initialRouteName : 'Menu',
    navigationOptions:{
        headerStyle:{
            backgroundColor:'#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color:'#fff'
        }
    }
});

const HomeNavigator = createStackNavigator({
    Home : {screen:Home}
},
    {
    navigationOptions:({navigation})=>({
        headerStyle:{
            backgroundColor:'#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color:'#fff'
        },
        headerLeft:<Icon name='menu' size={24}
            color="white"
            onPress={()=>navigation.toggleDrawer()} />
    })
});

const AboutNavigator = createStackNavigator({
    About : {screen:About}
},
    {
    navigationOptions:({navigation})=>({
        headerStyle:{
            backgroundColor:'#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color:'#fff'
        },
        headerLeft:<Icon name='menu' size={24}
            color="white"
            onPress={()=>navigation.toggleDrawer()} />
    })
});

const ContactNavigator = createStackNavigator({
    Contact : {screen:Contact}
},
    {
    navigationOptions:({navigation})=>({
        headerStyle:{
            backgroundColor:'#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color:'#fff'
        },
        headerLeft:<Icon name='menu' size={24}
            color="white"
            onPress={()=>navigation.toggleDrawer()} />
    })
});


const CustomDrawContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container}
        forceInset={{top:'always',horizontal:'never'}}>
            <View style={styles.drawHeader}>
                <View style={{flex:1}}>
                    <Image source={require('./images/logo.png')}
                        style={styles.drawImage} />
                </View>
                <View style={{flex:2}}>
                    <Text style={styles.drawHeaderText}>Le Casa De Papel</Text>
                </View>
            </View>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const MainNavigator = createDrawerNavigator({
    Home:{
      screen:HomeNavigator,
      navigationOptions:{
          title:'Home',
          drawerLabel :'Home',
          drawerIcon:({tintColor,focused})=>(
              <Icon name='home'
              type='font-awesome'
              size={24}
              color={tintColor} />
          )
      }  
    },
    About:{
        screen:AboutNavigator,
        navigationOptions:{
            title:'About Us',
            drawerLabel :'About Us',
            drawerIcon:({tintColor,focused})=>(
                <Icon name='info-circle'
                type='font-awesome'
                size={24}
                color={tintColor} />
            )
        }  
      },
    Menu:{
        screen:MenuNavigator,
      navigationOptions:{ 
          title:'Menu',
          drawerLabel :'Menu',
          drawerIcon:({tintColor,focused})=>(
            <Icon name='list'
            type='font-awesome'
            size={24}
            color={tintColor} />
        )
      } 
    },
    Contact:{
        screen:ContactNavigator,
        navigationOptions:{
            title:'Contact Us',
            drawerLabel :'Contact Us',
            drawerIcon:({tintColor,focused})=>(
                <Icon name='address-card'
                type='font-awesome'
                size={22}
                color={tintColor} />
            )
        }  
      }
},
    {
        drawerBackgroundColor : '#D1C4E9',
        contentComponent:CustomDrawContentComponent   
});

class Main extends Component
{
    componentDidMount()
    {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render(){
        return (
            <View style={{flex:1,/*paddingTop:Platform.OS==='ios'?0 : Expo.Constants.statusBarHeight*/}}>
                <MainNavigator />
            </View>
        );
    }
}


const styles=StyleSheet.create({
    container:{
        flex:1
    },
    drawHeader:{
        backgroundColor:'#512DA8',
        height:140,
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        flexDirection:'row'
    },
    drawHeaderText:{
        color:'white',
        fontSize:24,
        fontWeight:'bold'
    },
    drawImage:{
        margin:10,
        width:80,
        height:60
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Main);