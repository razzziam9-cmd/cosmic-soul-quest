import { Hono } from 'hono';
import { cors } from "hono/cors";
import { Autumn } from "autumn-js";

interface Bindings {
  AUTUMN_SECRET_KEY: string;
  VITE_BASE_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>()
  .basePath('api');

app.use(cors({
  origin: "*"
}));

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Checkout endpoint - creates a Stripe checkout session
app.post('/checkout', async (c) => {
  const body = await c.req.json();
  const { productId, customerId, successUrl, cancelUrl } = body;
  
  if (!productId) {
    return c.json({ error: "Product ID is required" }, 400);
  }
  
  const autumn = new Autumn({ secretKey: c.env.AUTUMN_SECRET_KEY });
  const baseUrl = c.env.VITE_BASE_URL || 'http://localhost:5173';
  
  try {
    // Generate a unique customer ID if not provided (for anonymous checkout)
    const customerIdentifier = customerId || `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    const { data } = await autumn.attach({
      customer_id: customerIdentifier,
      product_id: productId,
      success_url: successUrl || `${baseUrl}/success?product=${productId}`,
    });
    
    // Return the checkout URL for redirection
    if (data?.checkout_url) {
      return c.json({ url: data.checkout_url, customerId: customerIdentifier });
    }
    
    // If no URL, the product might already be attached
    return c.json({ success: true, message: "Product attached", customerId: customerIdentifier });
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ 
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

export default app;
