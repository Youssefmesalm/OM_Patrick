import { configureStore } from '@reduxjs/toolkit'
import TabsReducer from './Reducer/TabsReduces'
import SymbolsReducer from './Reducer/SymbolsReducer'


export default configureStore({
    reducer: {
        tabs: TabsReducer,
        symbols: SymbolsReducer

    },
})