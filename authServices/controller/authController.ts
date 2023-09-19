import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendOpeningAccountMail } from "../utils/email";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { userName, password, email } = req.body;
    const salt: any = await bcrypt.genSalt(10);
    const hash: any = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(32).toString("hex")
    const token = jwt.sign(value, "secret");

    const user = await prisma.authModel.create({
      data: {
        password: hash,
        email,
        userName,
        token,
        store:[]
      },
    });
    sendOpeningAccountMail(user).then(()=>{
        // console.log("mail sent successfully")
    })
    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "Error creating user",
      data: error.message,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.authModel.findUnique({
      where: { email },
    });
    if (user) {
      const check = await bcrypt.compare(password, user.password);

      if (check) {
        if (user.verified && user.token === "") {
          const token = jwt.sign({ id: user.id }, "secret", {
            expiresIn: "5d",
          });

          req.headers.authorization=`Bearer ${token}`;

          return res.status(201).json({
            message: "created token",
            data: token,
          });
        } else {
          return res.status(404).json({
            message: "not gotten token",
          });
        }
      } else {
        return res.status(404).json({
          message: "wrong password",
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const veiwAllUser = async(req:Request, res:Response)=>{
    try {
        const user = await prisma.authModel.findMany({})

        return res.status(200).json({
            message:"can view all users",
            data: user
        })
    } catch (error:any) {
        return res.status(404).json({
            message: "error",
            data: error.message,
          });
    }
}

export const verifyUser = async(req:Request, res:Response)=>{
    try {

        const {userID} =req.params
        const user = await prisma.authModel.findUnique({
            where:{id:userID}
        })

        if (user?.token !=="") {
            const userData =await prisma.authModel.update({
                where:{id:user?.id},
                data:{
                    verified:true,
                    token:""
                }
            })
            return res.status(200).json({
                message:"user verified successfully",
                data: userData
            })
        } else {
            return res.status(404).json({
                message:"user not verified",
            })
        }
    } catch (error:any) {
        return res.status(404).json({
            message: "error",
            data: error.message,
          });
    }
}

export const deleteUser = async(req:Request, res:Response)=>{
    try {

        const {userID} = req.params
        const user = await prisma.authModel.delete({
            where:{id: userID}
        })

        return res.status(200).json({
            message:"deleted successfully",
            data: user
        })
    } catch (error:any) {
        return res.status(404).json({
            message: "error",
            data: error.message,
          });
    }
}

export const getOneUser = async(req:Request, res:Response)=>{
    try {

        const {userID} = req.params
        const user = await prisma.authModel.findUnique({
            where:{id: userID}
        })

        return res.status(200).json({
            message:"can see one user successfully",
            data: user
        })
    } catch (error:any) {
        return res.status(404).json({
            message: "error",
            data: error.message,
          });
    }
}