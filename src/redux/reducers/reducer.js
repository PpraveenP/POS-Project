const INIT_STATE = {
    carts: [],
    lists:[],
    users:[]

};


export const cartreducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case "ADD_CART":

        const IteamIndex = state.carts.findIndex((iteam)=> iteam.food_id=== action.payload.food_id);

        if(IteamIndex >= 0){
            state.carts[IteamIndex].qnty +=1
            return {
                ...state,
                carts:[...state.carts]
            }
        }else{
            const temp = {...action.payload,qnty:1}
             return {
                ...state,
                carts: [...state.carts, temp]
            }
        }

           

        case "RMV_CART":
            const data = state.carts.filter((el)=>el.food_id !== action.payload); 
            // console.log(data);

            return {
                ...state,
                carts:data
            }

        case "RMV_ONE":
            const IteamIndex_dec = state.carts.findIndex((iteam)=> iteam.food_id === action.payload.food_id);
   
            if(state.carts[IteamIndex_dec].qnty >= 1){
                const dltiteams = state.carts[IteamIndex_dec].qnty -= 1
                console.log([...state.carts,dltiteams]);

                return {
                    ...state,
                    carts:[...state.carts]
                }
            }else if(state.carts[IteamIndex_dec].qnty === 1 ){
                const data = state.carts.filter((el)=>el.id !== action.payload);

                return {
                    ...state,
                    carts:data
                }
            }

case "ADD_ONE":
            const IteamIndex_inc = state.carts.findIndex((iteam)=> iteam.food_id === action.payload.food_id);
   
            if(state.carts[IteamIndex_inc].qnty >= 1){
                const dltiteams = state.carts[IteamIndex_inc].qnty += 1
                console.log([...state.carts,dltiteams]);

                return {
                    ...state,
                    carts:[...state.carts]
                }
            }else if(state.carts[IteamIndex_inc].qnty === 1 ){
                const data = state.carts.filter((el)=>el.food_id !== action.payload);

                return {
                    ...state,
                    carts:data
                }
            }
            
            case "ADD_LIST":

                return{
                    ...state,
                    lists: [...state.lists,action.payload]
                }


            // const ListIndex = state.lists.findIndex((list) => list.id === action.payload.id);

            // if (ListIndex >= 0) {
            //     state.lists[ListIndex].qnty += 1
            //     return {
            //         ...state,
            //         carts: [...state.lists]
            //     }
            // } else {
            //     const temp = { ...action.payload, qnty: 1 }
            //     return {
            //         ...state,
            //         lists: [...state.lists, temp]
            //     }
            // }

        default:
            return state
    }
}