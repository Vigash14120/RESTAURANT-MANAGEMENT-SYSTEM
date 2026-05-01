import {
  CustomerOrderDto,
  TicketDto,
  OrderTicketDto,
  KitchenOrderDto,
  ServiceOrderDto,
  KitchenTicketLogDto,
  EmergencyRequestDto,
  PaymentAreaDto
} from "@rms/shared-types";

import * as repository from "./repository.js";
import {
  CreateCustomerOrderInput,
  CreateTicketInput,
  CreateOrderTicketInput,
  CreateKitchenOrderInput,
  CreateServiceOrderInput,
  CreateKitchenTicketLogInput,
  CreateEmergencyRequestInputType,
  CreatePaymentAreaInput
} from "./schemas.js";

export async function createCustomerOrderFlow(input: CreateCustomerOrderInput): Promise<CustomerOrderDto> {
  const id = await repository.createCustomerOrder(input.customerId, input.tableNumber, input.dishType);
  const order = await repository.getCustomerOrderById(id);
  if (!order) {
    throw new Error("Failed to retrieve created customer order.");
  }
  return order;
}

export async function getCustomerOrderFlow(id: number): Promise<CustomerOrderDto | null> {
  return repository.getCustomerOrderById(id);
}

export async function listCustomerOrdersFlow(): Promise<CustomerOrderDto[]> {
  return repository.listCustomerOrders();
}

export async function createTicketFlow(input: CreateTicketInput): Promise<TicketDto> {
  const id = await repository.createTicket(input.customerOrderId, input.partySize);
  const ticket = await repository.getTicketById(id);
  if (!ticket) {
    throw new Error("Failed to retrieve created ticket.");
  }
  return ticket;
}

export async function getTicketFlow(id: number): Promise<TicketDto | null> {
  return repository.getTicketById(id);
}

export async function listTicketsFlow(): Promise<TicketDto[]> {
  return repository.listTickets();
}

export async function createOrderTicketFlow(input: CreateOrderTicketInput): Promise<OrderTicketDto> {
  const id = await repository.createOrderTicket(input.ticketId, input.customerOrderId);
  const orderTicket = await repository.getOrderTicketById(id);
  if (!orderTicket) {
    throw new Error("Failed to retrieve created order ticket.");
  }
  return orderTicket;
}

export async function getOrderTicketFlow(id: number): Promise<OrderTicketDto | null> {
  return repository.getOrderTicketById(id);
}

export async function listOrderTicketsFlow(): Promise<OrderTicketDto[]> {
  return repository.listOrderTickets();
}

export async function createKitchenOrderFlow(input: CreateKitchenOrderInput): Promise<KitchenOrderDto> {
  const id = await repository.createKitchenOrder(input.tableNumber, input.staffMemberId);
  const kitchenOrder = await repository.getKitchenOrderById(id);
  if (!kitchenOrder) {
    throw new Error("Failed to retrieve created kitchen order.");
  }
  return kitchenOrder;
}

export async function getKitchenOrderFlow(id: number): Promise<KitchenOrderDto | null> {
  return repository.getKitchenOrderById(id);
}

export async function listKitchenOrdersFlow(): Promise<KitchenOrderDto[]> {
  return repository.listKitchenOrders();
}

export async function createServiceOrderFlow(input: CreateServiceOrderInput): Promise<ServiceOrderDto> {
  const id = await repository.createServiceOrder(input.tableNumber, input.isAlcoholic);
  const serviceOrder = await repository.getServiceOrderById(id);
  if (!serviceOrder) {
    throw new Error("Failed to retrieve created service order.");
  }
  return serviceOrder;
}

export async function getServiceOrderFlow(id: number): Promise<ServiceOrderDto | null> {
  return repository.getServiceOrderById(id);
}

export async function listServiceOrdersFlow(): Promise<ServiceOrderDto[]> {
  return repository.listServiceOrders();
}

export async function createKitchenTicketLogFlow(input: CreateKitchenTicketLogInput): Promise<KitchenTicketLogDto> {
  const dispatchDate = input.dispatchTime ? new Date(input.dispatchTime) : null;
  const id = await repository.createKitchenTicketLog(input.customerId, input.emergencyId ?? null, dispatchDate);
  const log = await repository.getKitchenTicketLogById(id);
  if (!log) {
    throw new Error("Failed to retrieve created kitchen ticket log.");
  }
  return log;
}

export async function getKitchenTicketLogFlow(id: number): Promise<KitchenTicketLogDto | null> {
  return repository.getKitchenTicketLogById(id);
}

export async function listKitchenTicketLogsFlow(): Promise<KitchenTicketLogDto[]> {
  return repository.listKitchenTicketLogs();
}

export async function createEmergencyRequestFlow(input: CreateEmergencyRequestInputType): Promise<EmergencyRequestDto> {
  const orderTimeDate = new Date(input.orderTime);
  const id = await repository.createEmergencyRequest(input.orderTicketId, orderTimeDate);
  const emergencyRequest = await repository.getEmergencyRequestById(id);
  if (!emergencyRequest) {
    throw new Error("Failed to retrieve created emergency request.");
  }
  return emergencyRequest;
}

export async function getEmergencyRequestFlow(id: number): Promise<EmergencyRequestDto | null> {
  return repository.getEmergencyRequestById(id);
}

export async function listEmergencyRequestsFlow(): Promise<EmergencyRequestDto[]> {
  return repository.listEmergencyRequests();
}

export async function createPaymentAreaFlow(input: CreatePaymentAreaInput): Promise<PaymentAreaDto> {
  const id = await repository.createPaymentArea(input.emergencyOrderId);
  const paymentArea = await repository.getPaymentAreaById(id);
  if (!paymentArea) {
    throw new Error("Failed to retrieve created payment area.");
  }
  return paymentArea;
}

export async function getPaymentAreaFlow(id: number): Promise<PaymentAreaDto | null> {
  return repository.getPaymentAreaById(id);
}

export async function listPaymentAreasFlow(): Promise<PaymentAreaDto[]> {
  return repository.listPaymentAreas();
}
