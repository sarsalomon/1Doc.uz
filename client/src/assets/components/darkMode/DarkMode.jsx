
import  SunIcon  from "./imgDarkMode/Sun.svg";
import  MoonIcon from "./imgDarkMode/Moon.svg";
import { ReactSVG } from "react-svg";
import "./style.css";

const DarkMode = () => {
    
    const  setDarkMode=()=>{
       document.querySelector("body").setAttribute("data-theme","dark");
    }
    const  setLightMode=()=>{
        document.querySelector("body").setAttribute("data-theme","light");
     }
   
     const toggleTheme=(e)=>{
        if(e.target.checked) setDarkMode();
        else setLightMode();
     }
     
    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkMode-toggle'
                onChange={toggleTheme} 
            />
            <label htmlFor='darkMode-toggle' className='dark_mode_label' >
            
               <ReactSVG className='light' src={SunIcon} alt="" value='light'/>
                <ReactSVG className='dark' src={MoonIcon} alt="" value='dark' />
            </label>
        </div>
    );
};

export default DarkMode;
