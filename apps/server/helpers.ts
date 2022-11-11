export const checkConfig = (
  category: string,
  configObj: { [key: string]: any },
  skip: string[] = [],
): void => {
  const configToCheck = Object.keys(configObj).filter((cfg) => !skip.includes(cfg));

  configToCheck.forEach((cfg) => {
    if (configObj[cfg] === undefined) {
      throw new Error(`${category}.${cfg} config is required but no value was provided.`);
    }
  });
};
