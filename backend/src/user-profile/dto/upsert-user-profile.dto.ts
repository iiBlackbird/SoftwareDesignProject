import { 
    IsString, 
    IsOptional, 
    IsArray, 
    ArrayNotEmpty, 
    Length, 
    registerDecorator, 
    ValidationOptions, 
    ValidationArguments 
  } from 'class-validator';
  
  
  // Custom validator to check if each element in an array is a valid date string
  export function IsArrayOfDates(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isArrayOfDates',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            return Array.isArray(value) && value.every(v => !isNaN(Date.parse(v)));
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be an array of valid date strings`;
          },
        },
      });
    };
  }
  
  export class UpsertUserProfileDto {
    @IsString()
    @Length(1, 50)
    fullName: string;
  
    @IsString()
    @Length(1, 100)
    address1: string;
  
    @IsOptional()
    @IsString()
    @Length(0, 100)
    address2?: string;
  
    @IsString()
    @Length(1, 100)
    city: string;
  
    @IsString()
    @Length(2, 2)
    state: string;
  
    @IsString()
    @Length(5, 9)
    zip: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    skills: string[];
  
    @IsOptional()
    @IsString()
    preferences?: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsArrayOfDates({ message: 'availability must be an array of valid date strings' })
    availability: string[];
  }
  