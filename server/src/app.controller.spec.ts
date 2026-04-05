import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from './app.controller'

describe('AppController', () => {
    let appController: AppController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController]
        }).compile()

        appController = app.get<AppController>(AppController)
    })

    describe('getHealth', () => {
        it('should return status ok and a timestamp', () => {
            const result = appController.getHealth()
            expect(result.status).toBe('ok')
            expect(typeof result.timestamp).toBe('string')
            expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp)
        })
    })
})
