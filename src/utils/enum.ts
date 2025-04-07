export const mapStringToEnum = <T extends Record<string, string>>(
  enumType: T,
  value: string
): T[keyof T] | undefined => {
  return (Object.values(enumType) as string[]).includes(value)
    ? (value as T[keyof T])
    : undefined;
};