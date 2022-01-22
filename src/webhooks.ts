import { stripe } from './';
import Stripe from 'stripe';

/**
 * Business logic for specific webhook event types. kinda like a switch
 */
const webhookHandlers = {

    // key is name of event. value is function to handle event
    //takes event data as argument, strong typed
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
      console.log("payment_intent.succeeded webhook");
      // Add your business logic here
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
      console.log("payment_intent.payment_failed webhook");
      // Add your business logic here
    },
    'payment_intent.created': async (data: Stripe.PaymentIntent) => {
        console.log("payment_intent.created webhook");
        // Add your business logic here
    },
    'charge.succeeded': async (data: Stripe.PaymentIntent) => {
        console.log("charge.succeeded webhook");
        // Add your business logic here
    },
}

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
export const handleStripeWebhook = async(req, res) => {
  // want raw buffer instead of json
  const sig = req.headers['stripe-signature'];
  // guarantees that data is legit from stripe
  const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  //try block for different webhook events
  try {
    await webhookHandlers[event.type](event.data.object);
    res.send({received: true});
  } catch (err) {
    console.error(err)
    res.status(400).send(`Webhook Error: ${err}`);
  }
}