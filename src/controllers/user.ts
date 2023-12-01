import {Request,Response} from "express";
import {UsersModel} from "../model";

 class User {
    public getUser = async(req:Request,res:Response)=>{
        const {userType,level} = req.params
        try{
            let user:any;
            if(userType === "staff"){
                //if user staff
                user = await UsersModel.findAll({
                    where:{
                        userType
                    }
                })
                
            }else if(userType === "student"){
                // user student
                user = await UsersModel.findAll({
                    where:{
                        userType,
                        level
                    }
                })
            }else{
                // user undefined
                user = await UsersModel.findAll()
            }
            if(!user){
                return res.json({
                    status:false,
                    message:'no user found'
                })
            }
            return res.json({
                status:true,
                message:`${user.length} users found`,
                data:user
            })
        }catch(err){
            return res.json({
                status:false,
                message:err
            })
        }
    }
    }

export const UserController = new User();
