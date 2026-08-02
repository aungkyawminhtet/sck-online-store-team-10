import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApprovePointDto,
  CalculatePointDto,
  CreatePointDto,
} from './point.dto';
import { PointService } from './point.service';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  async getPoint(@Query('userId') userId: string) {
    return this.pointService.getPoint(Number(userId));
  }

  @Post()
  async createPoint(@Body() body: CreatePointDto) {
    return this.pointService.deductPoint(body);
  }

  @Post('approve')
  async approvePoint(@Body() body: ApprovePointDto) {
    return this.pointService.approvePoint(body);
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  calculatePoint(@Body() body: CalculatePointDto) {
    return { points: this.pointService.calculatePoint(body.amount) };
  }
}
