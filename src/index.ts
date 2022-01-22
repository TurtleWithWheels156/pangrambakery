// Stripe key env variables
import { config } from "dotenv"

if (process.env.NODE_ENV !== 'production') {
  // use whatever env variables in docker container or server
  config();
  console.log('loaded prod env variables');
}

//init stripe
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

//init express; braces for app because it was exported
import { app } from './api';
const port = process.env.PORT || 3333;
//backtick for string templatings
app.listen(port, () => console.log(`Api available on port ${port}`));