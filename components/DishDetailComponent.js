import React,{Component} from 'react';
import {View,Text,ScrollView,FlatList,StyleSheet,Modal,Button,Alert,PanResponder} from 'react-native';
import {Card,Icon,Rating,Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {postFavorite,postComment} from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
const mapDispatchToProps = dispatch => ({
    postFavorite:(dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
});

const mapStateToProps = state => {
    return {
        dishes:state.dishes,
        comments:state.comments,
        favorites:state.favorites
    }
}

function RenderDish(props)
{
    
    const dish=props.dish;
    
    handleViewRef= ref => this.view =ref;

    const recognizeDrag =({moveX,moveY,dx,dy})=> {
        if (dx<-200)
            return true;
        else
            return false;
    }

    const panResponder= PanResponder.create({
        onStartShouldSetPanResponder:(e,gestureState) =>{
            return true;
        },
        onPanResponderGrant: ()=> {
            this.view.rubberBand(1000)
            .then(endState=>console.log(endState.finished?'finished':'Cancelled'))
        },
        onPanResponderEnd:(e,gestureState)=> {
            if (recognizeDrag(gestureState))
            {
                Alert.alert(
                    'Add to Favorites',
                    'Are you sure you wish to add '+dish.name+' to your Favorites?',
                    [
                        {
                            text:'Cancel',
                            onPress:()=>console.log("Cancel pressed"),
                            style:'cancel'
                        },
                        {
                            text:'OK',
                            onPress:()=>props.favorite ? console.log('Already favorite'):props.onPress()
                        }
                    ],
                    {cancelable:false}
                );
            }
            else if (!recognizeDrag(gestureState))
            {
                props.edit();
            }
            return true;
        }
    })


    if (dish!=null)
    {
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}
                    ref={this.handleViewRef}
                    {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{uri:baseUrl+dish.image}}>
                    <Text style={{margin:10}}>
                        {dish.description}
                    </Text>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1,flexDirection:'row'}}>
                        <Icon raised reverse name={props.favorite?'heart':'heart-o'} 
                        type='font-awesome' 
                        color='#f50' 
                        onPress={()=> props.favorite ? console.log('Already favorite'):props.onPress()}/>
                        <Icon raised reverse name='pencil' 
                        type='font-awesome' 
                        color='#512DA8' 
                        onPress={()=>props.edit()}/>
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else
    {
        return (<View/>);
    }
}

function RenderComments(props)
{
    const comments= props.comments;
    const renderCommentItem = ({item,index}) => {
        return (
            <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
                <View  key={index} style={{margin:10}}>
                    <Text style={{fontSize:14}}>{item.comment}</Text>
                    <Text style={{fontSize:12}}>{item.rating} Stars</Text>
                    <Text style={{fontSize:12}}>{'--- '+item.author+', '+item.date} </Text>
                </View>
            </Animatable.View>
        );

    }
    return (
        <Card title="Comments">
            <FlatList data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item=>item.id.toString()}/>
        </Card>
    );
}

class DishDetail extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            showModal:false,
            author:'',
            comment:'',
            rating:''
        };
        
    }
    
    toggleModal()
    {
        this.setState({showModal:!this.state.showModal});
    }
    markFavorite(dishId)
    {
        this.props.postFavorite(dishId);
    }



    static navigationOptions = {
        title : 'Dish Details' 
    };
    render()
    {
        const dishId = this.props.navigation.getParam('dishId','');
        
        return (
            
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el=>el===dishId)}
                    onPress={()=>this.markFavorite(dishId)}
                    edit={()=>this.toggleModal()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment)=>comment.dishId===dishId)} />
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={()=>this.toggleModal()}
                    onRequestClose ={()=>this.toggleModal()}
                    >
                        <View  style={styles.modal}>
                            <Rating showRating onFinishRating={rating => this.setState({ rating: rating })}/> 
                            <Input placeholder="Author" onChangeText={value => this.setState({ author: value })}  leftIcon={{type:'font-awesome',name:'user-o'}}/>
                            <Input placeholder="Comment" onChangeText={value => this.setState({ comment: value })} leftIcon={{type:'font-awesome',name:'comment-o'}}/>
                            <View>
                                <Button  onPress={()=>{this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);this.toggleModal();}} color='#512DA8' title='SUBMIT'/>
                                <Text></Text>
                                <Button onPress={()=>this.toggleModal()} color='#292b2c' title='CANCEL'/>
                            </View>
                        </View>

                </Modal>
            </ScrollView>
        );    
    }
}

const styles= StyleSheet.create({
    modal:{
        justifyContent:'center',
        margin:20,
    }
});



export default connect(mapStateToProps,mapDispatchToProps)(DishDetail);