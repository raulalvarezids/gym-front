import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SectionRutine from "../calorias/SectionRutine";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IconContext } from "react-icons";
import AddSection from "./AddSection";
import toast, {Toaster} from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import { checkToken } from '../../checkToken/checkToken';
import {useNavigate} from 'react-router-dom'

function Rutine() {
    const [rutinas,setRutinas] = useState([])
    const [show,setShow] = useState(false)
    const user = useSelector((state) =>state.user )    
    
    const [change,setChange] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() =>{
        const statusToken = checkToken(user.time,dispatch)            
            
        if (statusToken){                                                    
            setTimeout(()=> {
                navigate('/')
            },1500)
        }else{
            axios.get(import.meta.env.VITE_APIHOST+'/rutine/byuser', 
            {headers : {
                'Authorization': `Bearer ${user.token}`   
            }})
            .then(response => {                                                
                setRutinas(response.data)            
            })
            .catch(error => {        
            });        
        }

      
    },[change])

    const handleShow =()=>{
        setShow(!show)
    }

    const showToast = () => {
        toast.success("Creado correctamente",{duration:1000})
    }

    return (  
        <div className="main__container__both">
         <Toaster
                position="top-center"
                reverseOrder={false}            
        />


            <h1 className="ll__rutinas__profile">Rutinas</h1>
        {

            rutinas.length < 3 ?  (<div className="add__container">        
                <IconContext.Provider value={{ color: "white", className: "icon__provider__profile" }}>
                        <IoIosAddCircleOutline  className="icon__add" onClick={() => handleShow()}/>
            </IconContext.Provider>        
        </div> )
        : 

        <h1 onClick={() => console.log(rutinas.length)}>Alcanzaste el limite de 3</h1>

        }

        

        <AddSection show={show} change= { () => {setChange(change+1)}}  hdshow ={ ()=> setShow(false)} toast={ () => showToast()}/>        
        

        
        { 
           rutinas.length > 0 ?  rutinas.map( rutina => (
                <SectionRutine id={rutina.rutine.id} key={rutina.rutine.id} rutinaname={rutina.rutine.namerutina} name={rutina.rutine.nameuser}  exercices={rutina.exercices}/>                
            ))
            : <h1 className="out__rutines">Sin rutinas</h1>
        }           
            
        </div> 


    );
}

export default Rutine;