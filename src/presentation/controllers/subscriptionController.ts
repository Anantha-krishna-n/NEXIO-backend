import Stripe from "stripe";
import { Request, Response } from "express";
import { SubscriptionService } from "../../services/SubscriptionService";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { ErrorMessages, SuccessMessages } from "../utils/Constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const { name, description, price, features, duration } = req.body;

      if (
        !name ||
        !description ||
        price === undefined ||
        !features ||
        !duration
      ) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_FIELDS });
        return;
      }

      if (!["free", "gold", "platinum"].includes(name)) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.INVALID_SUBSCRIPTION_NAME });
        return;
      }

      const subscription = await this.subscriptionService.createSubscription({
        name,
        description,
        price,
        features,
        duration,
      });

      res.status(HttpStatusCode.CREATED).json({
        message: SuccessMessages.SUBSCRIPTION_CREATED,
        subscription,
      });
    } catch (error) {
      console.log("getting error", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: ErrorMessages.FAILED_TO_CREATE_SUBSCRIPTION,
      });
    }
  }

  async getAllSubscriptions(req: Request, res: Response) {
    try {
      const subscriptions =
        await this.subscriptionService.getAllSubscriptions();
      res.status(HttpStatusCode.OK).json({ subscriptions });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: ErrorMessages.FAILED_TO_FETCH_SUBSCRIPTIONS,
      });
    }
  }

  async getSubscriptionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await this.subscriptionService.getSubscriptionById(
        id
      );
      res.status(HttpStatusCode.OK).json({ subscription });
    } catch (error) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorMessages.SUBSCRIPTION_NOT_FOUND,
      });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      console.log("husdf");
      const { id } = req.params;
      const updateData = req.body;
      console.log(updateData, "data");
      const subscription = await this.subscriptionService.updateSubscription(
        id,
        updateData
      );

      res.status(HttpStatusCode.OK).json({
        message: SuccessMessages.SUBSCRIPTION_UPDATED,
        subscription,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: ErrorMessages.FAILED_TO_UPDATE_SUBSCRIPTION,
      });
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      console.log("deleted");
      const { id } = req.params;
      console.log(id, "id");
      await this.subscriptionService.deleteSubscription(id);
      res.status(HttpStatusCode.OK).json({
        message: SuccessMessages.SUBSCRIPTION_DELETED,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: ErrorMessages.FAILED_TO_DELETE_SUBSCRIPTION,
      });
    }
  }

  async createCheckoutSession(req: Request, res: Response) {
    const { planId } = req.body;

    try {
      const plan = await this.subscriptionService.getSubscriptionById(planId);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.price * 100, 
        currency: "usd",
        // receipt_email:"example@gmail.com"
      });
      console.log("🚀 ~ router.post ~ paymentIntent:", paymentIntent);

      return res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  }
}
