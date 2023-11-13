/**
 * DTO to create a Manual Email Blast
 */
export interface CreateManualEmailBlastDTO {
  customers: Array<{
    email: string;
    name: string | null;
  }>;
}
