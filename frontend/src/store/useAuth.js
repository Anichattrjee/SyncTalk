import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore= create((set)=>({
    authUser: null,
    isSigninUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:null});
        }
    },

    signup:async(data)=>{
        set({isSigninUp:true});
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully.");
            

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigninUp:false});
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/signout");
            set({authUser:null});
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}));
