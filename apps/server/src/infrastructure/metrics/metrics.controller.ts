import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Controller('metrics')
export class MetricsController {
  @Public()
  @Get()
  getMetrics() {
    // PrometheusModule handles the /metrics endpoint automatically
    // This controller is for additional custom metrics endpoints if needed
    return { status: 'ok', message: 'Metrics are available at /metrics' };
  }
}
