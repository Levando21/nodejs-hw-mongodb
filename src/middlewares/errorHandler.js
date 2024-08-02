export async function errorHandler(err, req, res, next) {
  res
    .status(500)
    .send({ status: 500, message: 'Something went wrong', data: err.message });
}
