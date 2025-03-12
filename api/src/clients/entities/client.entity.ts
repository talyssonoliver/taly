import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Salon } from '../../salons/entities/salon.entity';
import { ClientNote } from './client-note.entity';
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
@ObjectType()
@ObjectType()
export class Client {
  @Field(() => ID)
  @Field(() => ID)
  id: string;
  @Field()
  @Field()
  salonId: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  userId: string;
  @Field()
  @Field()
  firstName: string;
  @Field()
  @Field()
  lastName: string;
  @Field()
  @Field()
  email: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  zipCode: string;
  @Field({ nullable: true })
  @Field({ nullable: true })
  birthdate: Date;
  @Field()
  @Field({ nullable: true })
  gender: Gender;
  @Field({ nullable: true })
  @Field({ nullable: true })
  referralSource: string;
  @Field(() => [String])
  @Field(() => [String], { nullable: true })
  tags: string[];
  @Field({ nullable: true })
  @Field({ nullable: true })
  notes: string;
  @Field(() => String)
  @Field(() => String, { nullable: true })
  preferences: Record<string, any>;
  @Field(() => String)
  @Field(() => String, { nullable: true })
  medicalInfo: Record<string, any>;
  @Field() => Salon)
  
  @Field(() => Salon)
  salon: Salon;
  @Field() => User, { nullable: true })
  
  @Field(() => User, { nullable: true })
  user: User;
  @Field() => ClientNote, (note) => note.client)
  @Field(() => [ClientNote], { nullable: true })
  notes: ClientNote[];
  @Field()
  @Field()
  createdAt: Date;
  @Field()
  @Field()
  updatedAt: Date;
  @Field()
  get fullName(): string {
    return ${this.firstName} ;
  }
}


