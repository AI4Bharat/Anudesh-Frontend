"use client"
import "./chat.css";
import { Grid, IconButton,Avatar,Tooltip,Typography} from "@mui/material";
import { InfoOutlined} from "@material-ui/icons";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Chat()
{
    const router = useRouter();
    return(
        <>
        
        
        <div className="w-100% h-100vh bg-white flex flex-col gap-2">
            <div className="flex justify-between">
            <img src="https://i.imgur.com/56Ut9oz.png" className="mt-4 ml-10 h-[61px] w-[60px]" onClick={() => router.push("/home") }></img>
            <div className="flex">
                <img src="https://i.imgur.com/FGmAyjz.png" className="w-6 h-6 mt-11"/>
                <img src="https://i.imgur.com/A3Rcbqe.jpeg" className="w-6 h-6 mt-11 ml-4"/>
                <h3 className="text-orange-600 text-xs font-bold mt-14">100</h3>
                <InfoOutlined
                    className="info-outline"           
                />             
                <SettingsOutlinedIcon
                    className="settings"
                />
                <Avatar
                    className="user-profile"
                /> 
            </div>      
                     
            </div>
            <div className="w-[98%] h-[55rem] mx-auto bg-stone-600 bg-opacity-5 rounded-2xl flex flex-col items-center">
                <div className="w-auto h-36 mt-20 mx-auto bg-white rounded-2xl flex flex-row gap-2">
                    <img src="https://i.imgur.com/56Ut9oz.png" className="mt-6 mx-5 h-[6.2rem] w-[6rem]"></img>
                    <div>
                    <h3 className="text-3xl text-orange-600 font-bold mt-8">Namaste</h3>
                    <p className="text-sm text-[#6c5f5b] font-normal mr-16">Tell me what’s on your mind or pick a suggestion. I have limitations and won't always get it right, but your <br></br> feedback will help me to improve.</p>
                    </div> 
                </div>
                <div className="grid grid-cols-3 gap-9 mt-16">
                    <div className="div-grid flex flex-col">
                        <h3 className="grid-heading">What is Anudesh?</h3>
                        <p className="text-xl mx-6">data leta hai multilingual(indic), will be used for model training for indic llms, 22, open source -  model and data</p>
                    </div>
                    <div className="div-grid">
                        <h3 className="grid-heading">How can you help?</h3>
                        <p className="text-xl mx-20 my-16">GIF</p>
                    </div>
                    <div className="div-grid">
                        <h3 className="grid-heading">Why Contribute?</h3>
                        <p className="text-xl mx-20 my-16">Graph</p>
                    </div>
                </div>

                <div className="mt-48 flex">
                    <input
                       className="myInput"
                       name=""
                       placeholder="Enter a prompt here"
                    /> 
                    <img src="https://i.imgur.com/2sWOT6F.png" className=" w-5 h-4 mt-4"/>
                </div>
            </div>
        </div>
        
        
        

        </>
    )
}
