import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/me`,
          {
            withCredentials: true 
          }
        );

        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("User not logged in", error.response?.data);
      }
    };

    getCurrentUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
