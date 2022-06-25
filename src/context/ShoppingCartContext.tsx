import {
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";
import {ShoppingCart} from "../components/ShoppingCart";
import {useLocalStorage} from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItemType = {
    id: number
    quantity: number
}

type ShoppingCartContextType = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItemType[],
    isOpenCart: boolean
}

const ShoppingCartContext = createContext({} as ShoppingCartContextType);

export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
}

export const ShoppingCartProvider = ( { children } : ShoppingCartProviderProps) => {

    const [cartItems, setCartItems] = useLocalStorage<CartItemType[]>('shopping-cart',[]);
    const [isOpenCart, setIsOpenCart] = useState(false);

    const openCart = () => setIsOpenCart(true);
    const closeCart = () => setIsOpenCart(false);

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

    const getItemQuantity = (id:number) => cartItems.find(item => item.id === id)?.quantity || 0;
    
    const increaseCartQuantity = (id: number) => {
        setCartItems(currItems => {
            if(!currItems.find(item => item.id === id)) {
                return [...currItems, {id, quantity: 1}]
            }
            return currItems.map(item => {
                if (item.id === id) {
                    return {...item, quantity: item.quantity + 1}
                }
                return item;
            })
        })
    }

    const decreaseCartQuantity = (id: number) => {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id);
            }
            return currItems.map(item => {
                if (item.id === id) {
                    return {...item, quantity: item.quantity - 1}
                }
                return item;
            })
        })
    }
    
    const removeFromCart = (id:number) => {
        setCartItems(cartItems.filter(item => item.id !== id))
    };

    return (
        <ShoppingCartContext.Provider value={{
            getItemQuantity,
            increaseCartQuantity,
            decreaseCartQuantity,
            removeFromCart,
            cartItems,
            cartQuantity,
            openCart,
            closeCart,
            isOpenCart
        }}>
            {children}
            <ShoppingCart
                isOpen={isOpenCart}
            />
        </ShoppingCartContext.Provider>
    )
}