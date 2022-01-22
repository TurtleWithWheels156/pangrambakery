//create a reusable function that we can use in our api/api endpoints
// client to make api calls
import { stripe } from './';
//sdk if we want to use for types
import Stripe from 'stripe';

/**
 * Creates a Stripe Checkout session with line items
 * can use in other files within the server
 * async allows us to unwrap promises with async await syntax
 */
export async function createStripeCheckoutSession(
  //what user wants to purchase
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {

  const url = 'http://localhost:3333'; //process.env.WEBAPP_URL;

  //how checkout session behaves
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/failed`,
  });

  console.log(JSON.stringify(session));
  console.log(session.id);

  // stripe creates a session w unique id that frontend code can use to show checkout page

  return session;
}
