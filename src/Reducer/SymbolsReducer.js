import { createReducer, createAction } from "@reduxjs/toolkit"

// Initial state of all tabs in the scrollable tabs component in src\components\scrollableTabs\ScrollableTabs.js: 
const initialState = {
    Symbols: []
}
// Reducer function for the symbols state 
const SymbolsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("SET_SYMBOLS", (state, action) => {    // Action handler
            state.Symbols = action.payload
        })
        .addCase("ADD_SYMBOL", (state, action) => {    // Action handler
            state.Symbols.push(action.payload)
        })
        .addCase("DELETE_SYMBOL", (state, action) => {    // Action handler
            state.Symbols = state.Symbols.filter(symbol => symbol !== action.payload)
        })
        .addCase("UPDATE_SYMBOL", (state, action) => {    // Action handler
            state.Symbols = state.Symbols.map(symbol => {
                if (symbol.id === action.payload.id) {
                    symbol.name = action.payload.name
                }
                return symbol;
            })
        })
}
) 
export const setSymbols = createAction("SET_SYMBOLS")  // Action creator
export const addSymbol = createAction("ADD_SYMBOL")  // Action creator
export const deleteSymbol = createAction("DELETE_SYMBOL")  // Action creator
export const updateSymbol = createAction("UPDATE_SYMBOL")  // Action creato


export default SymbolsReducer