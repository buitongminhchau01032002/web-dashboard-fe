import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customer: {
        name: '',
        phone: '',
        address: '',
    },
    details: [], // {productSIze, quantity}
    totalPrice: 0,
};

function updateTotalPrice(state) {
    state.totalPrice = state.details.reduce((prevPrice, currDetail) => {
        return prevPrice + currDetail.quantity * currDetail.price;
    }, 0);
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // payload {productSize, price}
        add: (state, action) => {
            //add
            const indexDetail = state.details.findIndex(
                (detail) => detail.productSize._id === action.payload.productSize._id
            );
            if (indexDetail !== -1) {
                return state;
            } else {
                state.details.push({
                    productSize: action.payload.productSize,
                    price: action.payload.price,
                    quantity: 1,
                });
            }
            updateTotalPrice(state);
        },

        // payload: {_id}
        remove: (state, action) => {
            state.details = state.details.filter(
                (detail) => detail.productSize._id !== action.payload
            );
            updateTotalPrice(state);
        },

        // payload: {_id, quantity}
        updateQuantity: (state, action) => {
            const indexDetail = state.details.findIndex(
                (detail) => detail.productSize._id === action.payload._id
            );
            if (indexDetail !== -1) {
                if (
                    state.details[indexDetail].productSize.quantity <
                    Number(action.payload.quantity)
                ) {
                    state.details[indexDetail].quantity =
                        state.details[indexDetail].productSize.quantity;
                    return;
                }
                if (Number(action.payload.quantity) <= 0) {
                    return state;
                }
                state.details[indexDetail].quantity = Number(action.payload.quantity);
            }
            updateTotalPrice(state);
        },

        updateCustomer: (state, action) => {
            state.customer = action.payload;
        },
        reset: () => initialState,
    },
});

// Action creators are generated for each case reducer function
const orderReducer = orderSlice.reducer;
const orderActions = orderSlice.actions;

export default orderReducer;
export { orderActions };
