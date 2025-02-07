import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

const fetchCurrentUser = async () => {
  const { data } = await axios.get("/api/v1/user/getuserid", {
    withCredentials: true, // Ensures cookies (tokens) are sent with the request
  });
  return data;
};

const CurrentUser = () => {
    console.log("inside userid function")
  const { data, error, isLoading } = useQuery("currentUser", fetchCurrentUser);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user data</p>;

  return (
    <div>
      <h2>Current User</h2>
      <p><strong>ID:</strong> {data?.data?._id}</p>
      <p><strong>Full Name:</strong> {data?.data?.fullName}</p>
      <p><strong>Email:</strong> {data?.data?.email}</p>
      <p><strong>Username:</strong> {data?.data?.username}</p>
    </div>
  );
};

export default CurrentUser;
