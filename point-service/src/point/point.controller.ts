import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { PointService } from './point.service';
import { CreatePointDto, CalculatePointDto } from './point.dto';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

const otelLogger = logs.getLogger('point-service');

@Controller('point')
export class PointController {
  private readonly logger = new Logger(PointController.name);

  constructor(private readonly pointService: PointService) {}

  @Get()
  async getPoint() {
    this.logger.log('GET /point request received');
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: 'Get points request received',
      attributes: {
        'log_type': 'business',
        'event': 'get_points_request',
        'entity_type': 'point',
      },
    });
    try {
      return await this.pointService.getPoint();
    } catch (error) {
      this.logger.error('PointService.getPoint internal error', error.stack);
      otelLogger.emit({
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        body: 'PointService.getPoint internal error',
        attributes: { 'error.message': error.message },
      });
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createPoint(@Body() body: CreatePointDto) {
    this.logger.log(
      `POST /point request received: userId=${body.userId}, orgId=${body.orgId}, amount=${body.amount}`,
    );
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: 'Deduct points request received',
      attributes: {
        'log_type': 'business',
        'event': 'deduct_points_request',
        'entity_type': 'point',
        'actor_id': body.userId,
        'org_id': body.orgId,
        'amount': body.amount,
      },
    });
    try {
      return await this.pointService.deductPoint(body);
    } catch (error) {
      this.logger.error('PointService.deductPoint internal error', error.stack);
      otelLogger.emit({
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        body: 'PointService.deductPoint internal error',
        attributes: { 'error.message': error.message },
      });
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculatePoint(@Body() body: CalculatePointDto) {
    this.logger.log(`POST /point/calculate request received: amount=${body.amount}`);
    try {
      const points = this.pointService.calculatePoint(body.amount);
      return { points };
    } catch (error) {
      this.logger.error('PointService.calculatePoint internal error', error.stack);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
