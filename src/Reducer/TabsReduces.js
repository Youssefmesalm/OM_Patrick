import { createReducer, createAction } from "@reduxjs/toolkit"

// Initial state of all tabs in the scrollable tabs component in src\components\scrollableTabs\ScrollableTabs.js: 
const initialState = {
    tabs: {
        1: {

            name: "tab 1",
            Symbols: {},
        },
        2: {
            name: "tab 2",
            Symbols: {},

        },
        3: {

            name: "tab 3",
            Symbols: {},

        },
    },
    ActiveTab: 1,
    activeTabSymbol: {},
    orders: {},
    Account: {},
    Notifications: {},
    Cycles: {},
    TP:"",
}


const TabsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("SET_ACTIVE_TAB", (state, action) => {
            state.ActiveTab = action.payload.id
            state.activeTabSymbol = state.tabs[action.payload.id].Symbols
        })
        .addCase("SET_TABS", (state, action) => {
            state.ActiveTab = action.payload.ActiveTab;
            state.tabs = action.payload.tabs;
            state.activeTabSymbol = action.payload.activeTabSymbol
            state.TP=action.payload.TP

        })

        .addCase("ADD_TAB", (state, action) => {
            const newTabId = Object.keys(state.tabs).length + 1;
            const newTab = { ...action.payload, Symbols: {} };
            state.tabs[newTabId] = newTab;
        })

        .addCase("DELETE_TAB", (state, action) => {
            const tabIdToDelete = action.payload;
            const newTabs = {};

            Object.keys(state.tabs).forEach(tabId => {
                if (tabId !== tabIdToDelete) {
                    newTabs[tabId] = state.tabs[tabId];
                }
            });

            state.tabs = newTabs;
        })

        .addCase("UPDATE_TAB", (state, action) => {
            const { id, name } = action.payload;
            const newTabs = {};

            Object.keys(state.tabs).forEach(tabId => {
                if (tabId === id) {
                    newTabs[tabId] = { ...state.tabs[tabId], name };
                } else {
                    newTabs[tabId] = state.tabs[tabId];
                }
            });

            state.tabs = newTabs;
        })

        .addCase("ADD_SYMBOL_TAB", (state, action) => {
            const [symbol, obj, tabId] = action.payload;
            state.tabs[tabId].Symbols[symbol] = obj;
            state.activeTabSymbol = state.tabs[tabId].Symbols



        })

        .addCase("DELETE_SYMBOL", (state, action) => {
            const { symbol, activeTabId } = action.payload;
            if (state.tabs[activeTabId]?.Symbols) {
                delete state.tabs[activeTabId].Symbols[symbol];
                delete state.activeTabSymbol[symbol];
            }
        })

        .addCase("UPDATE_TAB_SYMBOL", (state, action) => {
            const [symbolName, changedValue, idx, activeTabId] = action.payload;

            state.tabs[activeTabId].Symbols[symbolName][idx] = changedValue;
            state.activeTabSymbol[symbolName][idx] = changedValue
        })
        .addCase("UPDATE_CYCLE_TAB", (state, action) => {
            const [symbolName, magic, changedValue, idx] = action.payload;

            state.Cycles[symbolName][magic][idx] = changedValue;

        })
        .addCase("Delete_Cycle", (state, action) => {
            const [symbolName, magic, idx] = action.payload;
            delete state.Cycles[symbolName][magic][idx];
        })
        .addCase("SET_ORDERS", (state, action) => {
            const newOrders = {}
            Object.keys(action.payload).forEach((order) => {
                const { symbol, magic } = action.payload[order]
                const TabsTotal = Object.keys(state.tabs).length    // get the total number of tabs
                
                // add the order to orders state under key  symbol name then  magic number then orderid
                if (magic > 10000 && magic < (TabsTotal + 1) * 10000) {
                    if (!newOrders[symbol]) {
                        newOrders[symbol] = {}
                    }
                    if (!newOrders[symbol][magic]) {
                        newOrders[symbol][magic] = {}
                    }
                    const tabNumber = magic.toString().slice(0, -4);
                   
                    if (!state.Cycles[symbol]) {

                        state.Cycles[symbol] = {}
                    }
                    if (!state.Cycles[symbol][magic] && tabNumber > 0)
                        state.Cycles[symbol][magic] = state.tabs[tabNumber].Symbols[symbol]
                    newOrders[symbol][magic][order] = { ...action.payload[order] }
                } 

            }
            )
            state.orders = newOrders
            if (Object.keys(state.orders).length === 0) {
                state.Cycles = {}
            }
            Object.keys(state.activeTabSymbol).forEach((symbol) => {
                const CyclesNumberperSymbol = [];
                let SymbolPnl = 0;
                Object.keys(state.orders).forEach((symb) => {
                    Object.keys(state.orders[symb]).forEach((magic) => {
                        if (symbol === symb && magic > state.ActiveTab * 10000 && magic < (state.ActiveTab + 1) * 10000) {
                            Object.keys(state.orders[symb][magic]).forEach((order) => {
                                SymbolPnl += state.orders[symb][magic][order].pnl
                            })
                            // check if we already have the order with the magic number 
                            CyclesNumberperSymbol.push(magic)
                        }
                    })

                }

                )
                state.tabs[state.ActiveTab].Symbols[symbol].CyclesNumbers = CyclesNumberperSymbol
                state.activeTabSymbol[symbol].CyclesNumbers = CyclesNumberperSymbol
                state.activeTabSymbol[symbol].LiveCycles = CyclesNumberperSymbol.length
                state.tabs[state.ActiveTab].Symbols[symbol].LiveCycles = CyclesNumberperSymbol.length
                state.activeTabSymbol[symbol].PNL = SymbolPnl

            })
        })

        .addCase("SET_ACCOUNT", (state, action) => {
            state.Account = action.payload
        })
        .addCase("SET_NOTIFICATIONS", (state, action) => {

            //set the notifications in the state object without isUnRead property   
            state.Notifications = action.payload
            
        })
        .addCase("MarkAllRead", (state, action) => {
            Object.keys(state.Notifications).forEach((id) => {
                state.Notifications[id].isUnRead = "false"
            })
        })
        .addCase("DeleteAllCycles", (state, action) => {
           state.Cycles = {}
        }   
        )
    .addCase("SET_TP", (state, action) => {
        state.TP = action.payload
    }
    )
})


export const setOrders = createAction("SET_ORDERS")
export const setAccount = createAction("SET_ACCOUNT")
export const setActiveTab = createAction("SET_ACTIVE_TAB")  // Action creator
export const setTabs = createAction("SET_TABS")  // Action creator
export const addTab = createAction("ADD_TAB")  // Action creator
export const deleteTab = createAction("DELETE_TAB")  // Action creator
export const updateTab = createAction("UPDATE_TAB")  // Action creator
export const addSymboltoTab = createAction("ADD_SYMBOL_TAB")  // Action creator
export const deleteTabSymbol = createAction("DELETE_SYMBOL")  // Action creator
export const updateTabSymbol = createAction("UPDATE_TAB_SYMBOL")  // Action creator
export const setNotifications = createAction("SET_NOTIFICATIONS")  // Action creator
export const updateCycleTab = createAction("UPDATE_CYCLE_TAB")  // Action creator
export const deleteCycle = createAction("Delete_Cycle")  // Action creator
export const DeleteAllCycles = createAction("DeleteAllCycles")  // Action creator
export const MarkAllRead = createAction("MarkAllRead")  // Action creator
export const setTp = createAction("SET_TP")  // Action creator
export default TabsReducer; // Reducer