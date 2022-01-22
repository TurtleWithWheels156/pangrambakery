import { stripe } from './'; // import stripe client

/**
 * Create a Payment Intent with a specific amount; certain payments need to be authorized with actual card issuer
 * Payment intents api contains additional ways to handle state of payment throught process.
 * 1. user is ready to pay
 * 2. create a payment intent for amount user intends to pay (server)
 * 3. send intent to frontend; collect card details with secure stripe elements
 * 4. submit intent and card to stripe (frontend)
 * 5. if successful, will send confirmation, if needs more auth it'll be handled by stripe
 */
 export async function createPaymentIntent(amount: number) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // receipt_email: 'hello@fireship.io', //possible to pass in existing customer/payment source
    });
  
    //paymentIntent.id
    //paymentIntent.status
  
    return paymentIntent;
}