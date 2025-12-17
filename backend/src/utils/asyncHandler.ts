import { NextFunction, Request, Response } from "express";
// const asyncHandler = (
//   requestHandler: (req: Request, res: Response, next: NextFunction) => void
// ) => {
//   (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(() => requestHandler(req, res, next)).catch((err) =>
//       next(err)
//     );
// };

const asyncHandler =
  async (
    requestHandler: (req: Request, res: Response, next: NextFunction) => void
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    requestHandler(req, res, next);
    try {
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };
//   what these functions do ?
// 1. when called  a handler fn is passed
// 2. the handler fn is called and then a callback fn is returned
// 3. we call that callack fn with our parameters and return the result or error
export { asyncHandler };
