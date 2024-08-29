import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/AuthSlice";
import { setUserId as setCartUserId } from "../redux/slices/CartSlice";
import { setUserId as setWishlistUserId } from "../redux/slices/WishlistSlice";
import { setUserId as adminHistoryUserId } from "../redux/slices/ProductSlice";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/Store";
import styled from "styled-components";

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

const LoginFormContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: #ff0000;
  text-align: center;
  margin-top: 10px;
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      dispatch(setCartUserId(user.token));
      dispatch(setWishlistUserId(user.token));
      if (user.user.email.endsWith("@intimetec.com")) {
        dispatch(adminHistoryUserId(user.token));
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <LoginWrapper>
      <LoginFormContainer>
        <Title>Login Page</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Submit</Button>
          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </LoginFormContainer>
    </LoginWrapper>
  );
};

export default LoginForm;
