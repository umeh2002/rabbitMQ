import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { myConnection } from "../utils/connection";
import amqp from "amqplib";


const amqpServer ="amqp://localhost:5672"
const prisma = new PrismaClient();

export const createProduct = async (req: any, res: Response) => {
  try {
    const { title, description, price } = req.body;

    const { id } = req.user;

    const product = await prisma.storeModel.create({
      data: {
        title,
        description,
        price,
        userID:id,
      },
    });
    myConnection("product", product)
    return res.status(201).json({
      message: "product created successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error creating product",
      data: error.message,
    });
  }
};

export const viewAllProduct = async (req: Request, res: Response) => {
    try {
      const product = await prisma.storeModel.findMany({});
      return res.status(200).json({
        message: "product created successfully",
        data: product,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error creating product",
        data: error.message,
      });
    }
  };

  export const viewOneProduct = async (req: Request, res: Response) => {
    try {

        const {productID} =req.params
      const product = await prisma.storeModel.findUnique({
        where:{id:productID}
      });
      return res.status(200).json({
        message: "product created successfully",
        data: product,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "error creating product",
        data: error.message,
      });
    }
  };