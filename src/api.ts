import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
export const app = express();

import { createStripeCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { handleStripeWebhook } from './webhooks';


//express process incoming body as string: meaning decode and parse on every request
//use middleware to change behavior of express;
//app.use(express.json());

//make api accessible to other urls, like frontend application.
app.use( cors({ origin: true }));

// Update the express middleware to include the body buffer as rawbody property
// need buffer because signed request.
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

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
 * req: body from client
 * res: body to send back
 * next: pass control to next matching route
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

/**
 * Payment Intents
 */

app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await createPaymentIntent(body.amount)
    );
  })
);

app.post('/hooks', runAsync(handleStripeWebhook));