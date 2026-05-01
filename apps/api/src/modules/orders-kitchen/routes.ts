import { Router, Request, Response, NextFunction } from "express";

import * as service from "./service.js";
import {
  createCustomerOrderSchema,
  createTicketSchema,
  createOrderTicketSchema,
  createKitchenOrderSchema,
  createServiceOrderSchema,
  createKitchenTicketLogSchema,
  createEmergencyRequestSchema,
  createPaymentAreaSchema,
  idParamSchema
} from "./schemas.js";

export const ordersKitchenRouter = Router();

ordersKitchenRouter.post(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createCustomerOrderSchema.parse(req.body);
      const data = await service.createCustomerOrderFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listCustomerOrdersFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = await service.getCustomerOrderFlow(id);
      if (!data) {
        res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Customer order not found" } });
        return;
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createTicketSchema.parse(req.body);
      const data = await service.createTicketFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listTicketsFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = await service.getTicketFlow(id);
      if (!data) {
        res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Ticket not found" } });
        return;
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/order-tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createOrderTicketSchema.parse(req.body);
      const data = await service.createOrderTicketFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/order-tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listOrderTicketsFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/kitchen-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createKitchenOrderSchema.parse(req.body);
      const data = await service.createKitchenOrderFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/kitchen-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listKitchenOrdersFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/service-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createServiceOrderSchema.parse(req.body);
      const data = await service.createServiceOrderFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/service-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listServiceOrdersFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/kitchen-ticket-logs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createKitchenTicketLogSchema.parse(req.body);
      const data = await service.createKitchenTicketLogFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/kitchen-ticket-logs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listKitchenTicketLogsFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/emergency-requests",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createEmergencyRequestSchema.parse(req.body);
      const data = await service.createEmergencyRequestFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/emergency-requests",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listEmergencyRequestsFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.post(
  "/payment-areas",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createPaymentAreaSchema.parse(req.body);
      const data = await service.createPaymentAreaFlow(input);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

ordersKitchenRouter.get(
  "/payment-areas",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.listPaymentAreasFlow();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);
