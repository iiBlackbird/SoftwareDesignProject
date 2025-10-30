import { Controller, Get, Param, Query, Post, HttpStatus, HttpException } from '@nestjs/common';
import { StatesService } from './states.service';
import { GetStatesQueryDto } from './dto/get-states-query.dto';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  async getAllStates(@Query() query: GetStatesQueryDto) {
    try {
      const result = await this.statesService.getAllStates(query);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('regions')
  async getRegions() {
    try {
      const result = await this.statesService.getRegions();
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('abbreviation/:abbreviation')
  async getStateByAbbreviation(@Param('abbreviation') abbreviation: string) {
    try {
      const result = await this.statesService.getStateByAbbreviation(abbreviation);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      const statusCode = error.message.includes('not found') 
        ? HttpStatus.NOT_FOUND 
        : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        {
          statusCode,
          message: error.message,
          error: statusCode === HttpStatus.NOT_FOUND ? 'Not Found' : 'Internal Server Error',
        },
        statusCode,
      );
    }
  }

  @Get(':id')
  async getStateById(@Param('id') id: string) {
    try {
      const result = await this.statesService.getStateById(id);
      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      const statusCode = error.message.includes('not found') 
        ? HttpStatus.NOT_FOUND 
        : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        {
          statusCode,
          message: error.message,
          error: statusCode === HttpStatus.NOT_FOUND ? 'Not Found' : 'Internal Server Error',
        },
        statusCode,
      );
    }
  }

  @Post('seed')
  async seedStates() {
    try {
      const result = await this.statesService.seedStates();
      return {
        statusCode: HttpStatus.CREATED,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}