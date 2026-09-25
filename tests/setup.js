// Rôle : Tests automatisés de cette fonctionnalité.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); localStorage.clear(); sessionStorage.clear(); });
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value() {} });
Object.defineProperty(window, 'scrollTo', { configurable: true, value() {} });