import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore= create((set)=>({
    authUser: null,
    isSigninUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    
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

    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/signin",data);
            set({authUser:res.data});
            toast.success("Signed in Successfully.");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIn:false});
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
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res= await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile picture updated successfully.");
        } catch (error) {
            console.log("Error in updateProfile Store Function");
            toast.error(error.response.data.message);
        }
        finally{
            set({isUpdatingProfile:false});
        }
    }
}));
