import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('health')
@Controller()
export class AppController {
    constructor() {}

    @Get('health')
    @ApiOperation({ summary: 'Health check', description: 'Returns server status and current timestamp' })
    @ApiResponse({
        status: 200,
        description: 'Server is healthy',
        schema: { example: { status: 'ok', timestamp: '2026-04-03T10:00:00.000Z' } }
    })
    getHealth(): { status: string; timestamp: string } {
        return { status: 'ok', timestamp: new Date().toISOString() }
    }
}
