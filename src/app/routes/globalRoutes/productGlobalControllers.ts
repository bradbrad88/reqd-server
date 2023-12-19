import { Router } from "express";
import { Controller, ControllerAdaptor } from "../../../types/IController";
import { z } from "zod";
import { getGlobalProducts } from "../../../domain/readModel";

const getProducts: Controller = async req => {
  const querySchema = z.object({
    query: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
  });
  const { query, page, pageSize } = querySchema.parse(req.query);
  const transformedFilters = { query };
  const pageValidated = parseInt(page || "1");
  const pageSizeValidated = Math.min(parseInt(pageSize || "20"), 50);
  return await getGlobalProducts(transformedFilters, pageValidated, pageSizeValidated);
};

export const getProductGlobalQueryControllers = (controllerAdaptor: ControllerAdaptor) => {
  const router = Router({ mergeParams: true });
  router.get("/", controllerAdaptor(getProducts));
  return router;
};
