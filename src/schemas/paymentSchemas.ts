import { object, string, number, minLength, minValue, array, optional, enum_ } from 'valibot';

export const invoicePaymentSchema = object({
  invoiceId: number('Invoice ID is required'),
  amountPaid: number([minValue(0.01, 'Amount paid must be greater than 0')]),
  paymentMethod: string([minLength(1, 'Payment method is required')]),
  paymentLocation: string([minLength(1, 'Payment location is required')]),
  transactionCode: optional(string()),
  paymentGateway: optional(string()),
  discounts: optional(array(
    object({
      discountType: string([minLength(1, 'Discount type is required')]),
      amount: number([minValue(0.01, 'Discount amount must be greater than 0')]),
      description: optional(string())
    })
  ))
});

export const standardRefundSchema = object({
  invoiceId: number('Invoice ID is required'),
  amount: number([minValue(0.01, 'Refund amount must be greater than 0')]),
  reason: string([minLength(1, 'Reason is required')]),
  authorizedBy: string([minLength(1, 'Authorized By is required')]),
  refundCategory: enum_(['CLINIC', 'DOCTOR'], 'Invalid refund category'),
  refundMethod: string([minLength(1, 'Refund method is required')])
});

export const adminOverrideRefundSchema = object({
  invoiceId: number('Invoice ID is required'),
  refundAmount: number([minValue(0.01, 'Refund amount must be greater than 0')]),
  refundMethod: string([minLength(1, 'Refund method is required')]),
  approvalNote: string([minLength(5, 'A detailed approval note is strictly required for overrides')])
});
