import { Request, Response } from "express";
import { ArticleModel } from "../model";
class ArticleController {
    post = async(req:any,res:Response)=>{
       try{
        const {article,title} = req.body
        const {id,isAdmin} = req?.user
        console.log(article,'article')
      if(!article){
        return res.json({
            status:false,
            message:'article cannot be blank'
        })
      }
      if(!title){
        return res.json({
            status:false,
            message:'title cannot be blank'
        })
      }
      if(isAdmin){
        await ArticleModel.create({
            article,
            userId: id,
            title,
            approved:true,
            approviedBy:id
          })
      }else{
        await ArticleModel.create({
            article,
            title,
            userId: id
          })
      }
      res.json({
        status: true,
        message:`Article on ${title} has been uploaded`
      })
       }catch(err){
        return res.json({
            status:false,
            message:"an error occured" + err
        })
       } 
    }
    getAll = async(req:any,res:Response)=>{
        try{
            let allArticle = await ArticleModel.findAll({
                where:{
                    approved:true,
                }
            }) 
          
                return res.json({
                    status: true,
                    message: `${allArticle.length} article${allArticle.length > 1 ? "s" : ""  } found`,
                    data:allArticle
                })
            
        }catch(err){
            return res.json({
                status:false,
                message:"an error occured" + err
            })
        }
    }
    getAllCreated = async(req:any,res:Response)=>{
        try{
            const {id,isAdmin} = req?.user
            let allArticle = await ArticleModel.findAll({
                where:{
                    userId:id,
                }
            }) 
          
                return res.json({
                    status: true,
                    message: `${allArticle.length} article${allArticle.length > 1 ? "s" : ""  } found`,
                    data:allArticle
                })
            
        }catch(err){
            return res.json({
                status:false,
                message:"an error occured" + err
            })
        }
    }
    approve = async(req:any,res:Response)=>{
        try{
            const {id,isAdmin} = req?.user
            const {articleId} = req.params
           console.log(isAdmin ,'is admin')
            if(!isAdmin){
                return res.json({
                    status:false,
                    message:"Only admin can Approve article"
                })
            }
            const articleExists =  await ArticleModel.findOne({
                where:{
                    id:articleId
                }
            })
            if(!articleExists){
                return res.json({
                    status:false,
                    message:"article do not exist"
                })
            }
            if(articleExists.approved){
                return res.json({
                    status:false,
                    message:"article already verified"
                })
            }
            await articleExists.update({
                approved:true,
                approviedBy:id
            })
            return res.json({
                status:true,
                message:`article ${articleExists.id} verified`
            })
        }catch(err){
            return res.json({
                status:false,
                message:"an error occured" + err
            })
        }
    }
    delete = async(req:any,res:Response)=>{
        try{
            const {articleId} = req.params
            const articleExists =  await ArticleModel.findOne({
                where:{
                    id:articleId
                }
            })
            if(!articleExists){
                return res.json({
                    status:false,
                    message:"article do not exist"
                })
            }
            await articleExists.destroy()
            res.json({
                status:true,
                message:`article ${articleId} has been deleted sucessfully`
            })
        }catch(err){
            return res.json({
                status:false,
                message:"an error occured" + err
            })
        }
        
    }
    getOne = async(req:any,res:Response)=>{
        try{
            const {articleId} = req.params
            const articleExists =  await ArticleModel.findOne({
                where:{
                    id:articleId
                }
            })
            if(!articleExists){
                return res.json({
                    status:false,
                    message:"article do not exist"
                })
            }
            return res.json({
                status:true,
                message:`article ${articleId} gotten`,
                data:articleExists
            })
        }catch(err:any){
            return res.json({
                status:false,
                message:"an error occured" + err
            })
        }
       
    }
}

const article =new ArticleController();
export default article