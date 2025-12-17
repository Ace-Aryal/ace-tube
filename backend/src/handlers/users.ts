import { Request, Response } from "express";

export function getUsers(
  request: Request,
  response: Response<{ id: string; name: string }>
) {
  response.status(200).send({ id: "1", name: "Dipesh" });
}

export function getUsersById(request: Request, response: Response) {
  response.send([]);
}
export async function createUser(request: Request<{}>, response: Response) {
  response.send([]);
}

export function editUserById(
  request: Request<
    { id: string },
    { id: string; success: boolean },
    // dont know about this second paramater
    { title?: string; description?: string },
    { return: boolean }
  >,
  response: Response<{ id: string; success: boolean }>
) {
  const userID = request.params.id;
  const data = request.body;
  //   const { description, title } = data;
  const shouldReturn = request.query.return;
  (console.log(data, userID, shouldReturn), "logs");
  response.send({ id: "1", success: true });
}

/// request : Request < ParamsObjectType , ResponseBodyType, ReuqestBodyType, QueryParamsType>
// eg. params : {id: string, organizationId: string}
// eg. ResponseBody : {users : User[]}
// e.g. RequestBody : {email:string,password:string}
// e.g. QueryParms : {limit:10,page:2}
