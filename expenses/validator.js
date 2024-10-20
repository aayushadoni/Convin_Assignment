import Joi from "joi";

// Validator for adding an expense
function validateAddExpense() {
  const bodySchema = Joi.object({
    description: Joi.string().required().messages({
      'any.required': 'Provide a description for the expense',
    }),
    amount: Joi.number().min(0).required().messages({
      'number.min': 'Provide a valid amount',
      'any.required': 'Amount is required',
    }),
    splitMethod: Joi.string()
      .valid('equal', 'exact', 'percentage')
      .required()
      .messages({
        'any.only': 'Provide a valid split method',
      }),
    participants: Joi.array()
      .items(
        Joi.object({
          user: Joi.string().required().messages({
            'any.required': 'Provide a valid user ID for each participant',
          }),
          amount: Joi.number().min(0).optional().messages({
            'number.min': 'Amount must be a positive number',
          }),
          percentage: Joi.number().min(0).max(100).optional().messages({
            'number.min': 'Percentage must be between 0 and 100',
            'number.max': 'Percentage must be between 0 and 100',
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Provide at least one participant',
        'any.required': 'Participants are required',
      }),
  }).custom((value, helper) => {
    if (
      value.splitMethod === 'percentage' &&
      value.participants.some((p) => p.percentage === undefined)
    ) {
      return helper.message('Percentage is required for "percentage" split method');
    }
    return value;
  });
  return { bodySchema };
}

// Validator for updating an expense
function validateUpdateExpense() {
  const bodySchema = Joi.object({
    description: Joi.string().optional().messages({
      'string.empty': 'Provide a description for the expense',
    }),
    amount: Joi.number().min(0).optional().messages({
      'number.min': 'Provide a valid amount',
    }),
    splitMethod: Joi.string()
      .valid('equal', 'exact', 'percentage')
      .optional()
      .messages({
        'any.only': 'Provide a valid split method',
      }),
    participants: Joi.array()
      .items(
        Joi.object({
          user: Joi.string().optional().messages({
            'any.required': 'Provide a valid user ID for each participant',
          }),
        })
      )
      .min(1)
      .optional()
      .messages({
        'array.min': 'Provide at least one participant',
      }),
    status: Joi.string()
      .valid('pending', 'settled')
      .optional()
      .messages({
        'any.only': 'Provide a valid status',
      }),
  });
  return { bodySchema };
}

export {
  validateAddExpense,
  validateUpdateExpense,
};
