export const ErrorMessages = {
    REQUIRED_FIELDS: "Name, date, and time are required.",
    INVALID_INVITE_CODE: "Invalid or expired invite code.",
    FAILED_TO_CREATE_CLASSROOM: "Failed to create classroom.",
    FAILED_TO_FETCH_PUBLIC_CLASSROOMS: "Failed to fetch public classrooms.",
    FAILED_TO_JOIN_CLASSROOM: "Failed to join classroom.",
    FAILED_TO_FETCH_CLASSROOM_MEMBERS: "Failed to fetch classroom members.",
    FAILED_TO_SEND_INVITE: "Failed to send invite.",
    FAILED_TO_FETCH_PRIVATE_CLASSROOMS: "Failed to fetch private classrooms.",
    REQUIRED_CLASSROOM_ID: "Classroom ID is required",
    CLASSROOM_NOT_FOUND: "Classroom not found.",
    BAD_REQUEST: "Bad Request.",
    REQUIRED_CLASSROOM_ID_AND_EMAIL: "Classroom ID and email are required.",
    REQUIRED_INVITE_CODE_OR_USER_ID: "Invite code and user ID are required.",


  };
  
  export const SuccessMessages = {
    CLASSROOM_CREATED: "Classroom created successfully.",
    JOINED_CLASSROOM: "Successfully joined the classroom.",
    INVITATION_SENT: (email: string) => `Invitation sent to ${email}.`,
    CLASSROOM_FETCHED: "Classroom fetched successfully.",
    MEMBERS_FETCHED: "Classroom members fetched successfully",

  };
  
  export const GenericMessages = {
    INVITE_EMAIL: (inviteLink: string) =>
      `Hello, you have been invited to join the classroom. Use this link to join: ${inviteLink}`,
    DEFAULT_ERROR: "An unexpected error occurred",

  };
  