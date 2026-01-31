import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:'product',
    initialState:{
        products:[],
        cart:[],
        address:[],
        selectedAddress:null //currently choose address
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload
        },
        setCart:(state,action)=>{
            state.cart=action.payload
        },

        addAddress:(state,action)=>{
            if(!state.address) state.address=[];
            state.address.push(action.payload)
        },
        clearCart:(state)=>{
            state.cart=null;
        },
        setSelectedAddress:(state,action)=>{
            state.selectedAddress = action.payload
        },
        deleteAddress:(state,action)=>{
            state.address =state.address.filter((_,index)=>index !== action.payload)

            //Reset selectedAddress if it was deleted
            if(state.selectedAddress === action.payload){
                state.selectedAddress=null
            }
        }
    }
})
export const {setProducts,setCart,addAddress,setSelectedAddress,deleteAddress,clearCart }=productSlice.actions
export default productSlice.reducer