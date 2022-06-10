import {
  IsBoolean,
  IsDate,
  IsDateString,
  isDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^[A-Za-z][A-Za-z]*$/, {
    message: 'title is english character only.',
  })
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^[A-Za-z0-9][A-Za-z0-9]*$/, {
    message: 'subtitle is english and numberic  only.',
  })
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/^[A-Za-z0-9][A-Za-z0-9]*$/, {
    message: 'detail is english and numberic  only.',
  })
  detail: string;
  @IsNotEmpty()
  isPublish: Boolean | string;
  @IsNotEmpty()
  @IsDateString()
  publish_at_start: Date;
  @IsNotEmpty()
  @IsDateString()
  publish_at_end: Date;
}
