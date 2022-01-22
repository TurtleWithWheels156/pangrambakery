import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
export const app = express();

import { createStripeCheckoutSession } from './checkout';


//express process incoming body as string: meaning decode and parse on every request
//use middleware to change behavior of express;
app.use(express.json());

//make api accessible to other urls, like frontend application.
app.use( cors({ origin: true }));

app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
});

//moved because was missing references/configs
//most likely not working because no access to express json config

/**
 * Catch async errors when awaiting promises 
 * if error occurs, catch error and sends error response from endpoint
 * can wrap this around any endpoint callback that we may need
 */
 function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    // if req to stripe comes back with error (express usually doesn't catch this, and api hangs till timeout (limbo issue))
    callback(req, res, next).catch(next);
  };
}

//api endpoint that can create checkout session
/**
 * Checkouts
 */
app.post(
  '/checkouts/',
  //async callback to handle req and resp
  runAsync(async ({ body }: Request, res: Response) => {
    //await to receive body information then execute code 
    console.log(body);
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);
