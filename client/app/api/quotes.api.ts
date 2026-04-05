import type { AdminQuoteSummary, CreateQuoteInput, Quote, QuoteSummary } from '~/types/api.types'

import { httpClient } from './http-client'

export async function createQuote(data: CreateQuoteInput): Promise<Quote> {
    try {
        return await httpClient.post<Quote>('/quotes', data)
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to create quote')
    }
}

export async function getMyQuotes(): Promise<QuoteSummary[]> {
    try {
        return await httpClient.get<QuoteSummary[]>('/quotes')
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load quotes')
    }
}

export async function getQuoteById(id: string): Promise<Quote> {
    try {
        return await httpClient.get<Quote>(`/quotes/${id}`)
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load quote')
    }
}

export async function getAllQuotesAdmin(search?: string): Promise<AdminQuoteSummary[]> {
    try {
        return await httpClient.get<AdminQuoteSummary[]>(
            `/quotes/admin/all${search ? `?search=${encodeURIComponent(search)}` : ''}`
        )
    } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load quotes')
    }
}
