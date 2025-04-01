import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL="http://localhost:5001";

export const useAuthStore= create((set,get)=>({
    authUser: null,
    isSigninUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
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
            get().connectSocket();
            

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
            get().connectSocket();
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
            get().disconnectSocket();
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
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected)
        {
            return;
        }

        const socket=io(BASE_URL,{
            //paasing the userId as query to the backend for to find online users
            query:{
                userId:authUser._id
            }
        });
        socket.connect();
        set({socket:socket});

        //now get the online users
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        });
    },
    disconnectSocket:()=>{
        if(get().socket.connected) get().socket.disconnect();
    }
}));
