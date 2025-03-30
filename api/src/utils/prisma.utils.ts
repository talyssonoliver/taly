import { AppointmentStatus } from '@api/types/common.types';

/**
 * Safe way to handle object property removal without using delete operator
 * @param obj The object to remove properties from
 * @param props Array of property names to remove
 * @returns A new object without the specified properties
 */
export function omitProperties<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  props: K[]
): Omit<T, K> {
  const result = { ...obj };
  props.forEach(prop => {
    const { [prop]: _, ...rest } = result as any;
    Object.assign(result, rest);
  });
  return result;
}

/**
 * Safely cast string to AppointmentStatus enum
 * @param status String value to cast
 * @returns AppointmentStatus enum value
 */
export function toAppointmentStatus(status: string): AppointmentStatus {
  if (Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
    return status as AppointmentStatus;
  }
  throw new Error(`Invalid appointment status: ${status}`);
}
