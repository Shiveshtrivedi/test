
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/Store";
import {
  addToCart,
  clearCart,
  removeToCart,
  checkout,
} from "../redux/slices/CartSlice";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const CartContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 600px;
  height: 383px;
  margin: 0 auto;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;

const ItemImage = styled.img`
  width: 75px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
  margin-right: 15px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const ItemPrice = styled.span`
  color: #555;
`;

const QuantityButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const QuantitySpan = styled.span`
  font-size: 20px;
  margin: 0 10px;
`;

const ClearCartButton = styled.button`
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const TotalAmount = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
`;
const ItemNameLink = styled(Link)`
  text-decoration: none;
  color: #333;
`;
const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const userId = useSelector((state: RootState) => state.cart.userId) || "";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      toast.warn("Your cart is empty!");
      return;
    }

    setIsLoading(true);
    // try {
    //   await dispatch(checkout()).unwrap();
    //   toast.success("Checkout successful!");
    //   navigate("/checkout");
    // } catch (error) {
    //   toast.error("Checkout failed. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <CartContainer>
      {cartItems.length === 0 ? (
        <h1>Cart is empty</h1>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <Link to={`/products/${item.id}`} title={item.name}>
                <ItemImage src={item.image} alt={item.name} />
              </Link>
              <ItemDetails>
                <ItemNameLink to={`/products/${item.id}`} title={item.name}>
                  <ItemName>{item.name}</ItemName>
                </ItemNameLink>
                <ItemPrice>${item.price}</ItemPrice>
              </ItemDetails>
              <QuantityButton
                onClick={() => {
                  dispatch(removeToCart(item.id));
                  toast.error("Item removed from cart");
                }}
              >
                -
              </QuantityButton>
              <QuantitySpan>{item.quantity}</QuantitySpan>
              <QuantityButton
                onClick={() => {
                  dispatch(
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      quantity: 1,
                    })
                  );
                  toast.success("Item added to cart");
                }}
              >
                +
              </QuantityButton>
            </CartItem>
          ))}
          <TotalAmount>Total: ${totalAmount.toFixed(2)}</TotalAmount>
          <ClearCartButton
            onClick={() => {
              dispatch(clearCart());
              toast.error("Cart cleared");
            }}
          >
            Clear Cart
          </ClearCartButton>
          <button onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "Checkout"}
          </button>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;

