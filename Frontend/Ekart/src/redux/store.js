
import userSlice from './userSlice.js'
import productSlice from './productSlice.js'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const persistConfig = {
  key: 'Ekart',
  version: 1,
  storage,
}

const rootReducer=combineReducers({
    user:userSlice,
    product: productSlice,
    
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store