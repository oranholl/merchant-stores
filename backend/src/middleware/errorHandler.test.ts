import { describe, it, expect, vi, type Mock } from 'vitest';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler', () => {
  describe('AppError', () => {
    it('creates error with correct properties', () => {
      const error = new AppError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });

    it('captures stack trace', () => {
      const error = new AppError('Test error', 500);
      expect(error.stack).toBeDefined();
    });
  });

  describe('asyncHandler', () => {
    it('calls the wrapped function with req, res, next', async () => {
      const mockFn = vi.fn().mockResolvedValue(undefined);
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      const result = wrappedFn(req, res, next);
      
      // asyncHandler returns a Promise from Promise.resolve()
      await result;

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('catches and forwards errors to next', async () => {
      const error = new Error('Test error');
      const mockFn = vi.fn().mockRejectedValue(error);
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      const result = wrappedFn(req, res, next);
      
      // Wait for the promise to complete
      await result;

      expect(next).toHaveBeenCalledWith(error);
    });

    it('handles synchronous errors', async () => {
      const error = new Error('Sync error');
      const mockFn = vi.fn(() => {
        throw error;
      });
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      const result = wrappedFn(req, res, next);
      
      // Wait for the promise to complete
      await result;

      expect(next).toHaveBeenCalledWith(error);
    });

    it('handles AppError correctly', async () => {
      const error = new AppError('Custom error', 404);
      const mockFn = vi.fn().mockRejectedValue(error);
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      const result = wrappedFn(req, res, next);
      
      // Wait for the promise to complete
      await result;

      expect(next).toHaveBeenCalledWith(error);
      const calledError = next.mock.calls[0][0];
      expect(calledError.statusCode).toBe(404);
      expect(calledError.message).toBe('Custom error');
    });

    it('does not call next when function succeeds', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });

    it('works with functions that return values', async () => {
      const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('handles multiple sequential calls', async () => {
      const mockFn = vi.fn().mockResolvedValue(undefined);
      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn() as unknown as NextFunction & Mock;

      const wrappedFn = asyncHandler(mockFn);
      
      await wrappedFn(req, res, next);
      await wrappedFn(req, res, next);
      await wrappedFn(req, res, next);

      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });
});