import { ValidationPipe } from '@nestjs/common';

/**
 * Global Validation Pipe to be binded at application level to ensure
 * all endpoints only receive validated/correct data, where requests
 * with incorrect data won't even reach any of the controllers/services.
 */
export const GlobalValidationPipe = new ValidationPipe({
  // This automatically strips out any property that is not in the DTO.
  whitelist: true,

  // This ensures any non whitelisted property will cause the server to return
  // an error response. This works in conjunction with the `whitelist` property.
  forbidNonWhitelisted: true,

  // @todo Remove this since there is not much benefit to this
  // https://docs.nestjs.com/techniques/validation#transform-payload-objects
  // Transform payloads to be instances of the DTO classes.
  transform: true,

  // Stop validation of the given property on the first error to prevent wasting
  // server resources on validating entire object for all errors.
  stopAtFirstError: true,
});
