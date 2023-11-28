import { Joi } from "celebrate";

export const loginSchema = Joi.object({
  phoneNumber: Joi.string().min(10).max(12).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
  userType: Joi.string().valid("student", "staff","admin").required(),
});
