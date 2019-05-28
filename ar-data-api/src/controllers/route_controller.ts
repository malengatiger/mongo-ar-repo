import { Request, Response } from "express";

export const allRoutes = (req: Request, res: Response) => {
  res.send("Returns all Routes");
};

export const getRoute = (req: Request, res: Response) => {
  res.send("Returns one Route");
};

export const deconsteRoute = (req: Request, res: Response) => {
  res.send("Returns one Route");
};

export const updateRoute = (req: Request, res: Response) => {
  res.send("Returns one Route");
};

export const addRoute = (req: Request, res: Response) => {
  res.send("Returns one Route");
};