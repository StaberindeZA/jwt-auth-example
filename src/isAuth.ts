import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
  const authentication = <string>context.req.headers['authentication'];

  if (!authentication) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authentication.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }

  return next();
}