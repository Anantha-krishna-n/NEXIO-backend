import express from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { SubscriptionRepository } from '../../infrastructure/repositories/SubscriptionRepository'
import { SubscriptionService } from '../../services/SubscriptionService';
import { isAdmin } from '../../presentation/middlewares/isAdmin';
import { verifyAdminToken } from '../middlewares/AdminMiddleware';
import { refreshTokenHandler } from '../middlewares/TokenMiddleware';
const router = express.Router();

const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);



// Admin routes
router.post(
  '/plans', 
  verifyAdminToken,
  subscriptionController.createSubscription.bind(subscriptionController)
);

router.put(
  '/plans/:id', 
  
  subscriptionController.updateSubscription.bind(subscriptionController)
);

router.delete(
  '/plans/:id', 

  subscriptionController.deleteSubscription.bind(subscriptionController)
);

router.get(
  '/admin/plans', 
  verifyAdminToken,
  subscriptionController.getAllSubscriptions.bind(subscriptionController)
);
router.get('/plans',refreshTokenHandler,subscriptionController.getAllSubscriptions.bind(subscriptionController));
router.get(
  '/plans/:id', 
  subscriptionController.getSubscriptionById.bind(subscriptionController)
);


router.post('/create-checkout-session', refreshTokenHandler, subscriptionController.createCheckoutSession.bind(subscriptionController));
  


export default router;


