import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { removeToWishList } from "../redux/slices/WishlistSlice";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Link } from "react-router-dom";

const WishlistContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 800px;
  height: 383px;
  margin: 0 auto;
`;

const WishlistItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #dddddd;
  margin-bottom: 10px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 150px;
  object-fit: contain;
  border-radius: 4px;
  margin-right: 15px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ItemPrice = styled.p`
  font-size: 16px;
  color: #555555;
`;

const RemoveButton = styled.button`
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

const EmptyWishlistMessage = styled.p`
  font-size: 18px;
  color: #666666;
  text-align: center;
`;
const ItemNameLink = styled(Link)`
  text-decoration: none;
  color: #333;
`;

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch();
  const wishListItems = useSelector((state: RootState) => state.wishList.items);

  return (
    <WishlistContainer>
      <h1>Wishlist</h1>
      {wishListItems.length === 0 ? (
        <EmptyWishlistMessage>Your wishlist is empty.</EmptyWishlistMessage>
      ) : (
        wishListItems.map((item) => (
          <WishlistItem key={item.id}>
            <Link to={`/products/${item.id}`} title={item.name}>
              <ItemImage src={item.image} alt={item.name} />
            </Link>
            <ItemDetails>
              <ItemNameLink to={`/products/${item.id}`} title={item.name}>
                <ItemName>{item.name}</ItemName>
              </ItemNameLink>
              <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
            </ItemDetails>
            <RemoveButton
              onClick={() => {
                dispatch(removeToWishList(item.id));
                toast.error("Item removed from wishlist");
              }}
            >
              Remove
            </RemoveButton>
          </WishlistItem>
        ))
      )}
    </WishlistContainer>
  );
};

export default WishlistPage;
