# Standardization Guide for Core Components

## Services

Services should:

1. **Focus on business logic**: Keep database access in repositories
2. **Use descriptive method names**: Start with verbs (e.g., `createUser`, `findUserById`)
3. **Implement proper error handling**: Catch and log all errors
4. **Return typed responses**: Use interfaces/DTOs for return types
5. **Validate inputs**: Use DTOs for method parameters
6. **Use dependency injection**: Constructor inject dependencies
7. **Provide clear documentation**: JSDoc comments for methods
8. **Logging**: Include context-rich logging

Example structure:
```typescript
@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  constructor(
    private readonly exampleRepository: ExampleRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findById(id: string): Promise<ExampleEntity> {
    try {
      return this.exampleRepository.findById(id);
    } catch (error) {
      this.logger.error(`Error finding by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createDto: CreateExampleDto): Promise<ExampleEntity> {
    try {
      // Business logic
      const result = await this.exampleRepository.create(createDto);
      
      // Side effects via events
      this.eventEmitter.emit('example.created', result);
      
      return result;
    } catch (error) {
      this.logger.error(`Error creating example: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```
Controllers
Controllers should:

Handle HTTP requests/responses only: Business logic goes in services
Use appropriate HTTP verbs: GET, POST, PUT, PATCH, DELETE
Return consistent responses: Use TransformInterceptor
Validate inputs: Use DTOs with class-validator
Use proper HTTP status codes: 200, 201, 204, 400, 401, 403, 404, 500
Document with Swagger: Use ApiTags, ApiOperation, ApiResponse
Implement proper guards: Auth, Roles, Throttling
Handle pagination: Use @Query() parameters for page and limit

Example structure:
```typescript
@ApiTags('Examples')
@Controller('examples')
@UseInterceptors(TransformInterceptor)
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name);

  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all examples' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(ExampleResponseDto)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log(`Finding all examples with page=${page}, limit=${limit}`);
    return this.exampleService.findAll(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new example' })
  @ApiCreatedResponse({ type: ExampleResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExampleDto: CreateExampleDto) {
    this.logger.log(`Creating new example: ${JSON.stringify(createExampleDto)}`);
    return this.exampleService.create(createExampleDto);
  }
}
```
Repositories
Repositories should:

Handle all database access: SQL queries, Prisma calls
Use consistent naming: Methods like findMany, findById, create
Implement error handling: Try/catch all database calls
Support transactions: Accept transaction objects
Optimize queries: Select only needed fields
Sanitize inputs: Protect against SQL injection
Logging: Include context-rich logs with performance metrics
Support pagination: Methods should accept skip/take parameters

Example structure:
```typescript
@Injectable()
export class ExampleRepository {
  private readonly logger = new Logger(ExampleRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    select?: any;
  }) {
    const startTime = Date.now();
    try {
      return await this.prisma.example.findMany(options);
    } catch (error) {
      this.logger.error(`Error finding examples: ${error.message}`, error.stack);
      throw error;
    } finally {
      this.logger.debug(`findMany took ${Date.now() - startTime}ms`);
    }
  }

  async create(data: any, tx?: PrismaTransaction) {
    const prisma = tx || this.prisma;
    try {
      return await prisma.example.create({ data });
    } catch (error) {
      this.logger.error(`Error creating example: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```
