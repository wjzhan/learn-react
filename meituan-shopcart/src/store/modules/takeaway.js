import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

// 同步管理
const foodsSlice = createSlice({
	name: 'foods',
	initialState:{
		foodsList:[],
		activeIndex: 0,
		cartList:[]
	},
	reducers:{
		setFoodsList(state, action){
			state.foodsList = action.payload
		},
		changeActiveIndex(state, action){
			state.activeIndex = action.payload
		},
		// 添加购物车
		addCart(state, action){
			const item = state.cartList.find(item => item.id === action.payload.id)
			if (item){
				item.count ++
			}else{
				state.cartList.push({
				            ...action.payload,
				            count: 1
				        })
			}
		},
		// count增
		increCount(state, action){
			//找到当前要修改谁的count
			const item = state.cartList.find(item => item.id === action.payload.id)
			item.count++
		},
		// count减
		decreCount(state, action){
			//找到当前要修改谁的count
			const item = state.cartList.find(item => item.id === action.payload.id)
			if (item && item.count > 0){
			        item.count--
			}
		},
		//清空购物车
		clearCart(state){
			state.cartList = []
		}
	}
})

// 异步管理
const {setFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart} = foodsSlice.actions
const fetchFoodsList = () =>{
	return async (dispatch) => {
		const res = await axios.get('http://localhost:3004/takeaway')
		dispatch(setFoodsList(res.data))
	}
}

export {fetchFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart}

const reducer = foodsSlice.reducer

export default reducer