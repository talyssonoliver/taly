import { IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePlanDto {
  @ApiProperty({
    description: 'New plan ID',
    example: '7a9d25a1-8dfa-456c-8c82-8ddc190b74b8',
  })
  @IsNotEmpty()
  @IsUUID()
  @Field()
  newPlanId: string;

  @ApiProperty({
    description: 'Apply change immediately (or at next renewal)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true, defaultValue: false })
  immediateChange?: boolean;
}
