export const ErrorMessages = {
  // ClassroomController errors
  REQUIRED_FIELDS: "Name, date, and time are required.",
  INVALID_INVITE_CODE: "Invalid or expired invite code.",
  FAILED_TO_CREATE_CLASSROOM: "Failed to create classroom.",
  FAILED_TO_FETCH_PUBLIC_CLASSROOMS: "Failed to fetch public classrooms.",
  FAILED_TO_JOIN_CLASSROOM: "Failed to join classroom.",
  FAILED_TO_FETCH_CLASSROOM_MEMBERS: "Failed to fetch classroom members.",
  FAILED_TO_SEND_INVITE: "Failed to send invite.",
  FAILED_TO_FETCH_PRIVATE_CLASSROOMS: "Failed to fetch private classrooms.",
  FAILED_TO_VALIDATE_INVITE: "Failed to validate the invite code for the room.",
  REQUIRED_CLASSROOM_ID: "Classroom ID is required.",
  CLASSROOM_NOT_FOUND: "Classroom not found.",
  BAD_REQUEST: "Bad Request.",
  REQUIRED_CLASSROOM_ID_AND_EMAIL: "Classroom ID and email are required.",
  REQUIRED_INVITE_CODE_OR_USER_ID: "Invite code and user ID are required.",
  FAILED_TO_SEND_MESSAGE:"failed to send message",

  // AuthController errors
  ALL_FIELDS_REQUIRED: "All fields are required.",
  PASSWORDS_DO_NOT_MATCH: "Passwords don't match.",
  USER_ALREADY_EXISTS: "User already exists with this email.",
  REGISTRATION_PENDING_VERIFICATION: "User registration is pending verification.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  AUTHENTICATION_FAILED: "Authentication failed.",
 DEFAULT_ERROR:"An unexpected error occurs",
  EMAIL_AND_OTP_REQUIRED: "Email and OTP are required.",
  INVALID_OTP_OR_EXPIRED: "Invalid OTP or OTP expired.",
  LOGIN_FAILED: "Invalid credentials.",
  ACCOUNT_BLOCKED: "Access denied: Your account has been blocked. Please contact support for assistance.",
  EMAIL_REQUIRED: "Email is required.",
  OTP_RESEND_FAILED: "Failed to resend OTP.",
  LOGOUT_FAILED: "An unexpected error occurred during logout.",
  UNAUTHORIZED: "Unauthorized: User ID not found.",
  USER_NOT_FOUND: "User not found.",
  UPDATE_FAILED: "An error occurred while updating user details.",
  MISSING_UPDATE_FIELDS: "At least one field (name or profile picture) must be provided for update.",
  FORGOT_PASSWORD_FAILED:"failed to send forgotpassowrd verification ",
  INVALID_OR_EXPIRED_OTP:"Invalid otp orotp expired ",
  RESET_PASSWORD_FAILED:"failed to reset password",
  AILED_TO_FETCH_MESSAGES:"failed to fetch messages",



  FAILED_TO_FETCH_WHITEBOARD:"failed to fetch the whiteboard",
  WHITEBOARD_NOT_FOUND:"cannot find the white board",
  FAILED_TO_INITIALIZE_WHITEBOARD:"failed to intialize the whiteboard",
  FAILED_TO_UPDATE_WHITEBOARD:"failed to update the whiteboard",

  FAILED_TO_CANCEL_SUBSCRIPTION:"failed to cancel the subscription",
  FAILED_TO_FETCH_SUBSCRIPTION:"failed to fecth the subscription",
  SUBSCRIPTION_NOT_FOUND:"cannot find the subscription",
  FAILED_TO_CREATE_SUBSCRIPTION:"failed to create the subscription",



  INVALID_SUBSCRIPTION_NAME: 'Invalid subscription name. Must be free, gold, or platinum',
  FAILED_TO_FETCH_SUBSCRIPTIONS: 'Failed to fetch subscription plans',
  FAILED_TO_UPDATE_SUBSCRIPTION: 'Failed to update subscription plan',
  FAILED_TO_DELETE_SUBSCRIPTION: 'Failed to delete subscription plan',



};

export const SuccessMessages = {
  // ClassroomController success messages
  INVITE_CODE_VALID: "Successfully validated room.",
  CLASSROOM_CREATED: "Classroom created successfully.",
  JOINED_CLASSROOM: "Successfully joined the classroom.",
  INVITATION_SENT: (email: string) => `Invitation sent to ${email}.`,
  CLASSROOM_FETCHED: "Classroom fetched successfully.",
  MEMBERS_FETCHED: "Classroom members fetched successfully.",
  PASSWORD_RESET_SUCESSFULY:"password reset sucessfully",
  PASSWORD_RESET_OTP:"password reset otp sent sucessfully",

  // AuthController success messages
  USER_REGISTERED: "User registered successfully. Please check your email for OTP.",
  USER_VERIFIED: "User verified successfully.",
  OTP_SENT: "New OTP sent successfully.",
  LOGIN_SUCCESSFUL: "Login successful.",
  LOGOUT_SUCCESSFUL: "Logout successful.",
  USER_UPDATED: "User details updated successfully.",
  MESSAGE_SENT:"message sent sucessfully",


  WHITEBOARD_FETCHED:"fetched whiteboard sucessfully",
  WHITEBOARD_INITIALIZED:"white board intialize",
  WHITEBOARD_UPDATED:"whiteboard updated sucessfully",

  SUBSCRIPTION_CANCELLED:"subscription is canceled",
  SUBSCRIPTION_CREATED:"subscription created sucesssfully",
  SUBSCRIPTION_CONFIRM_SUCESSFULY:"subscription confirm sucessfully",


  SUBSCRIPTION_UPDATED: 'Subscription plan updated successfully',
  SUBSCRIPTION_DELETED: 'Subscription plan deleted successfully',



};

export const GenericMessages = {
  // ClassroomController generic messages
  INVITE_EMAIL: (inviteLink: string) =>
    `Hello, you have been invited to join the classroom. Use this link to join: ${inviteLink}`,
  DEFAULT_ERROR: "An unexpected error occurred.",

  // AuthController generic messages
  REGISTRATION_EMAIL_SUBJECT: "Welcome! Verify Your Email",
  OTP_EMAIL_SUBJECT: "Your OTP Code",
};
