import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import {
  deleteProduct,
  fetchProducts,
  removeProductFromHistory,
  resetFilter,
} from "../redux/slices/ProductSlice";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loading from "./Loading";
import { addToCart } from "../redux/slices/CartSlice";
import { addToWishList } from "../redux/slices/WishlistSlice";
import { toast } from "react-toastify";
import { fetchReviews } from "../redux/slices/UserReviewSlice";
import StarRating from "./StarRating";
import { IProduct, IWishListItem } from "../utils/interface/interface";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Container = styled.div`
  display: flex;
  max-width: 100%;
`;

const FilterBox = styled.div`
  width: 15%;
  padding: 20px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  box-shadow: 0 0 10px #00000020;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProductBox = styled.div<{ viewMode: string }>`
  width: 85%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: ${(props) => (props.viewMode === "grid" ? "row" : "column")};
`;

const FilterDropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 120px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
  box-shadow: 0 0 10px #00000020;
`;

const Price = styled.p`
  font-size: 16px;
  color: #666666;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 6px#00000020;
  margin-right: 10px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #3e8e41;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #2e7d32;
    transform: translateY(0);
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ProductNameContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover::after {
    content: attr(data-title);
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const FilterButton = styled.button`
  color: #4caf50;
  background-color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px #00000060;
  transition: background-color 0.2s ease-in-out;
  margin: 20px 20px;
  &:hover {
    background-color: #3e8e41;
    color: #ffffff;
    transform: translateY(0);
  }
`;

const ToggleButton = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 10px 10px 5px;
  box-shadow: 0 0 10px #00000040;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #3e8e41;
    transform: translateY(0);
  }
`;

const ProductGridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 27%;
  margin: 10px;
  border-radius: 10px;
`;

const ProductListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00000010;

  img {
    width: 100px;
    height: 120px;
    object-fit: contain;
    margin-right: 20px;
  }

  div {
    flex: 1;
  }
`;
const WishlistButton = styled.div<{ viewMode: string }>`
  background-color: #ff5722;
  color: #ffffff;
  padding: 8px 1px 8px 1px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 16px;
  font-weight: bold;
  width: ${(props) => (props.viewMode === "list" ? "90px" : "50px")};
  box-shadow: 0 4px 6px #00000020;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #e64a19;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #d84315;
    transform: translateY(0);
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Icon = styled(AiOutlineHeart)`
  margin-right: 8px;
  font-size: 20px;
`;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const reviews = useSelector((state: RootState) => state.reviews.reviews);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
    products.forEach((product: IProduct) => {
      dispatch(fetchReviews(product.id));
    });
  }, [dispatch, status, products]);

  const handlePriceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriceFilter(event.target.value);
  };

  const handleRatingFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRatingFilter(event.target.value);
  };

  const handleCategoryFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryFilter(event.target.value);
  };

  const getAverageRating = (productId: string) => {
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );
    const totalRating = productReviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    return productReviews.length ? totalRating / productReviews.length : 0;
  };

  const filteredProducts: IProduct[] = products.filter((product: IProduct) => {
    const averageRating = getAverageRating(product.id);

    const priceMatch =
      priceFilter === "all" ||
      (priceFilter === "low" && product.price < 50) ||
      (priceFilter === "medium" &&
        product.price >= 50 &&
        product.price < 100) ||
      (priceFilter === "high" && product.price >= 100);

    const ratingMatch =
      ratingFilter === "all" ||
      (ratingFilter === "1-star" && averageRating >= 1 && averageRating < 2) ||
      (ratingFilter === "2-star" && averageRating >= 2 && averageRating < 3) ||
      (ratingFilter === "3-star" && averageRating >= 3 && averageRating < 4) ||
      (ratingFilter === "4-star" && averageRating >= 4 && averageRating < 5) ||
      (ratingFilter === "5-star" && averageRating === 5);

    const categoryMatch =
      categoryFilter === "all" || product.category === categoryFilter;
    const searchMatch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return priceMatch && ratingMatch && categoryMatch && searchMatch;
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div>{error}</div>;
  }

  const handleAddToCart = (product: IProduct) => {
    dispatch(
      addToCart({
        id: parseInt(product.id),
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success("Item added to cart");
  };

  const handleAddToWishlist = (product: IProduct) => {
    const wishListItem: IWishListItem = {
      id: parseInt(product.id),
      name: product.title,
      price: product.price,
      image: product.image,
    };
    dispatch(addToWishList(wishListItem));
    toast.success(`added to wishlist`);
  };

  const handleToDelete = (id: string) => {
    dispatch(deleteProduct(id));
    dispatch(removeProductFromHistory(id));
    toast.error("Item deleted");
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
    setPriceFilter("all");
    setRatingFilter("all");
    setCategoryFilter("all");
  };

  return (
    <Container>
      <FilterBox>
        <FilterDropdown value={priceFilter} onChange={handlePriceFilterChange}>
          <option value="all">All Prices</option>
          <option value="low">Low ($50)</option>
          <option value="medium">Medium ($50 - $100)</option>
          <option value="high">High (≥ $100)</option>
        </FilterDropdown>

        <FilterDropdown
          value={ratingFilter}
          onChange={handleRatingFilterChange}
        >
          <option value="all">All Ratings</option>
          <option value="1-star">1 Star</option>
          <option value="2-star">2 Stars</option>
          <option value="3-star">3 Stars</option>
          <option value="4-star">4 Stars</option>
          <option value="5-star">5 Stars</option>
        </FilterDropdown>

        <FilterDropdown
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men clothing</option>
          <option value="women's clothing">Women clothing</option>
        </FilterDropdown>

        <FilterButton onClick={handleResetFilter}>Reset Filters</FilterButton>
        <ToggleButton
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? "List" : "Grid"} View
        </ToggleButton>
      </FilterBox>

      <ProductBox viewMode={viewMode}>
        {filteredProducts.map((product: IProduct) =>
          viewMode === "grid" ? (
            <ProductGridItem key={product.id}>
              <Link to={`/products/${product.id}`} title={product.title}>
                <Image src={product.image} alt={product.title} />
              </Link>
              <Link to={`/products/${product.id}`} title={product.title}>
                <ProductNameContainer data-title={product.title}>
                  {product.title}
                </ProductNameContainer>
              </Link>
              <Price>{product.price}$</Price>
              <StarRating
                rating={getAverageRating(product.id)}
                onRatingChange={undefined}
                interactive={false}
              />
              <div style={{ display: "flex" }}>
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                {isAdmin && (
                  <Button onClick={() => handleToDelete(product.id)}>
                    Delete
                  </Button>
                )}
                <WishlistButton
                  viewMode={viewMode}
                  onClick={() => handleAddToWishlist(product)}
                >
                  <Icon />
                </WishlistButton>
              </div>
            </ProductGridItem>
          ) : (
            <ProductListItem key={product.id}>
              <Link to={`/products/${product.id}`} title={product.title}>
                <Image src={product.image} alt={product.title} />
              </Link>
              <ProductNameContainer data-title={product.title}>
                {product.title}
              </ProductNameContainer>
              <Price>{product.price}$</Price>
              <StarRating
                rating={getAverageRating(product.id)}
                onRatingChange={undefined}
                interactive={false}
              />
              <Button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
              {isAdmin && (
                <Button onClick={() => handleToDelete(product.id)}>
                  Delete
                </Button>
              )}  
              <WishlistButton
                viewMode={viewMode}
                onClick={() => handleAddToWishlist(product)}
              >
                <Icon /> Wishlist
              </WishlistButton>
            </ProductListItem>
          )
        )}
      </ProductBox>
    </Container>
  );
};

export default ProductList;
