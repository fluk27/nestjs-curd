import {
  IsAlpha,
  IsAlphanumeric,
  IsArray,
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
  @IsAlpha('en-US',{
    message: 'title is english character only.',
  })
  @Length(1, 20)
  // @Matches(/^[A-Za-z][A-Za-z]*$/, {
  //   message: 'title is english character only.',
  // })
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @IsAlphanumeric('en-US', {
    message: 'subtitle is english and numberic  only.',
  })
  // @Matches(/^[A-Za-z0-9][A-Za-z0-9]*$/, {
  //   message: 'subtitle is english and numberic  only.',
  // })
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @IsAlphanumeric('en-US', {
    message: 'subtitle is english and numberic  only.',
  })
  // @Matches(/^[A-Za-z0-9][A-Za-z0-9]*$/, {
  //   message: 'detail is english and numberic  only.',
  // })
  detail: string;
  @IsOptional()
  oldFilesId?:string[]|number[]
  @IsNotEmpty()
  isPublish: Boolean | string;
  @IsNotEmpty()
  @IsDateString()
  publish_at_start: Date;
  @IsNotEmpty()
  @IsDateString()
  publish_at_end: Date;
}
