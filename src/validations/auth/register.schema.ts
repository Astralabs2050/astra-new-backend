import { Joi } from "celebrate";

export const registrationSchema = Joi.object({
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  level: Joi.string().optional(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
  userType: Joi.string().valid("student", "staff").required(),
});
