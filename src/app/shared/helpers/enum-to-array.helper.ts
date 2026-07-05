/*
 * Преобразует перечисление в массив его значений, исключая указанные значения.
 * @param Enum Перечисление, которое необходимо преобразовать в массив.
 * @param excludes Значения, которые необходимо исключить из результирующего массива.
 * @returns Массив значений перечисления, исключая указанные значения.
 */
export const enumToArray = <E extends Record<string, string | number>>(
  Enum: E,
  ...excludes: E[keyof E][]
): E[keyof E][] => {
  return Object.keys(Enum)
    .filter((enumKey) => Number.isNaN(Number(enumKey)))
    .map((enumKey) => Enum[enumKey as keyof E])
    .filter((enumValue) => !excludes.includes(enumValue));
};
