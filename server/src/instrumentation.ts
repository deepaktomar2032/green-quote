import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'

const otlpUrl = process.env['OTEL_EXPORTER_OTLP_ENDPOINT']

const sdk = new NodeSDK({
    serviceName: process.env['OTEL_SERVICE_NAME'],
    traceExporter: new OTLPTraceExporter({ url: otlpUrl }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: otlpUrl })
    }),
    logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter({ url: otlpUrl })),
    instrumentations: [getNodeAutoInstrumentations()]
})

sdk.start()

export async function shutdownTelemetry(): Promise<void> {
    await sdk.shutdown()
}

export function setupShutdownHandlers(app: { close: () => Promise<unknown> }): void {
    const shutdown = async (): Promise<void> => {
        await app.close()
        await shutdownTelemetry()
    }

    const onShutdown = (): void => {
        shutdown().catch((err) => {
            console.error('Shutdown error:', err)
            process.exit(1)
        })
    }

    process.once('SIGTERM', onShutdown)
    process.once('SIGINT', onShutdown)
}
