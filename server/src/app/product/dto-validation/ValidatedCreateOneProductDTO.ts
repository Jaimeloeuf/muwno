import { type CreateOneProductDTO, SurveyMode } from 'domain-model';
import { IsNotEmpty, IsString, MaxLength, IsEnum } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneProductDTO implements CreateOneProductDTO {
  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(SurveyMode)
  @IsNotEmpty()
  readonly surveyMode!: SurveyMode;
}
