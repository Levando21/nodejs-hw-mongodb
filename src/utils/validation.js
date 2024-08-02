export const validateContactPayload = (payload) => {
  const requiredFields = [
    'isFavorite',
    'email',
    'phoneNumber',
    'name',
    'contactType',
  ];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Validation failed: ${missingFields.join(', ')} is required.`,
    };
  }

  return { isValid: true };
};
