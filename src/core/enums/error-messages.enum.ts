export enum ErrorMessages {
  USER_NOT_FOUND = 'User not found',
  USER_EXISTS = 'User already exists',
  BAD_CREDENTIALS = 'Bad credentials',
  WRONG_PASSWORD = 'Wrong password',
  TOKEN_NOT_FOUND = 'Token not found',
  TOKEN_EXPIRED = 'Token has expired',
  FORGOT_PASSWORD_TOKEN_NOT_FOUND = 'Forgot password token not found',
  FORGOT_PASSWORD_TOKEN_EXPIRED = 'Forgot password token has expired',
  FILE_UPLOAD_FAILED = 'Could not upload file to the server',
  FILE_REMOVE_FAILED = 'Could not remove file from the server',
  NOT_OWNER = `Can't access this resource`,
  FILE_TYPE_NOT_ALLOWED = 'File type not allowed',
}
