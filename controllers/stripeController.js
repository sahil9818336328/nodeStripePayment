const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// NOTE :- AS OUR APP CANNOT DIRECTLY COMMUNICATE WITH THE STRIPE AS IT WOULD BE HIGHLY INSECURE, SO ON PAGE LOAD WE GET CLIENT_SECRET USING STRIPE.PAYMENTINTENTS.CREATE, AND ONCE WE HAVE THE CLIENT_SECRET ONLY THEN WE CAN COMMUNICATE WITH STRIPE AKA- MAKE PAYMENTS USING STRIPE.

const stripeController = async (req, res) => {
  const { total_amount, shipping_fee } = req.body

  const calculateOrderAmount = () => {
    return total_amount + shipping_fee
  }

  // INTERNATIONAL PAYMENTS - INDIA, GETTING CLIENT_SECRET
  const paymentIntent = await stripe.paymentIntents.create({
    description: 'Software development services',
    shipping: {
      name: 'Jenny Rosen',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    },
    amount: calculateOrderAmount(),
    currency: 'usd',
    payment_method_types: ['card'],
  })

  res.json({ clientSecret: paymentIntent.client_secret })
}

module.exports = stripeController
