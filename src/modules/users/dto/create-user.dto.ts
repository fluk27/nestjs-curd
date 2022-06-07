import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @Length(1, 20)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9][A-Za-z0-9]*$/, {
    message: 'firstName is english character only.',
  })
  username: string;
  @IsNotEmpty()
  @Length(8,20)
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
    {
      message:
        'pasword is english character and number only',
    },
  )
  password: string;
  @Length(1, 20)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z][A-Za-z]*$/, {
    message: 'firstName is english character only.',
  })
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^[A-Za-z][A-Za-z]*$/, {
    message: 'lastName is english character only.',
  })
  lastName: string;
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
