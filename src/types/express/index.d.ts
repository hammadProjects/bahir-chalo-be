import { UserDocument } from "../../utils/types"; // adjust path if needed

declare global {
  namespace Express {
    export interface Request {
      // why did not used extends?? (read)
      user?: UserDocument;
    }
  }
}
