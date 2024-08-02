export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
//Викристовується для замикання, щоб багато разів не використовувати try catch у контроллерів
